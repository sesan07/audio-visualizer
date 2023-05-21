import { Injectable, NgZone } from '@angular/core';
import { AnalyserMode, Oomph } from './audio.source.service.types';
import { DomSanitizer } from '@angular/platform-browser';
import { BaseSourceService } from './base.source.service';
import { Source } from './base.source.service.types';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AudioSourceService extends BaseSourceService {
    sources: Source[] = [{ name: 'Default', src: 'assets/audio/default.mp3' }];

    mode: AnalyserMode = 'frequency';
    oomph: Oomph;

    isPlaying$: Observable<boolean>;
    duration$: Observable<number>;
    currentTime$: Observable<number>;

    private _isPlaying$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    private _duration$: BehaviorSubject<number> = new BehaviorSubject(0);
    private _currentTime$: BehaviorSubject<number> = new BehaviorSubject(0);

    private _audioContext: AudioContext = new AudioContext();
    private _audioElement: HTMLAudioElement;
    private _sourceNode: MediaElementAudioSourceNode;
    private _analyserNodeMap: Map<number, AnalyserNode> = new Map();
    private _amplitudesMap: Map<number, Uint8Array> = new Map();
    private _sampleCounts: number[] = [8, 16, 32, 64, 128, 256, 512];
    private _oomphAmplitudes: Uint8Array;
    private _maxOomphAmplitudeTotal: number;
    private readonly _showLowerData: boolean = false;
    private readonly _smoothingTimeConstant: number = 0.7;

    constructor(private _ngZone: NgZone, sanitizer: DomSanitizer, messageService: NzMessageService) {
        super(sanitizer, messageService);

        this.isPlaying$ = this._isPlaying$.asObservable();
        this.duration$ = this._duration$.asObservable();
        this.currentTime$ = this._currentTime$.asObservable();

        this.setUpAmplitudes();
    }

    get sampleCounts(): number[] {
        return this._sampleCounts.slice();
    }

    togglePlay(): void {
        if (this._isPlaying$.value) {
            this.pause();
        } else {
            this.play();
        }
    }

    setCurrentTime(val: number): void {
        this._audioElement.currentTime = val;
    }

    getAmplitudes(sampleCount: number): Uint8Array {
        return this._amplitudesMap.get(sampleCount);
    }

    play(): void {
        if (this._audioContext.state !== 'running') {
            this._audioContext.resume().then(() => {
                this._audioElement.play();
            });
        } else {
            this._audioElement.play();
        }
        this._isPlaying$.next(true);
    }

    pause(): void {
        this._audioElement.pause();
        this._isPlaying$.next(false);
    }

    previous(): void {
        const currIndex: number = this.sources.indexOf(this.activeSource);
        if (currIndex - 1 >= 0) {
            this.setActiveSource(this.sources[currIndex - 1]);
            setTimeout(() => this.play());
        }
    }

    next(): void {
        const currIndex: number = this.sources.indexOf(this.activeSource);
        if (currIndex + 1 < this.sources.length) {
            this.setActiveSource(this.sources[currIndex + 1]);
            setTimeout(() => this.play());
        }
    }

    formatTime(seconds: number): string {
        seconds = isNaN(seconds) ? 0 : seconds;
        const hasHours: boolean = Math.floor(seconds / 3600) > 0;
        return new Date(1000 * seconds).toISOString().substr(hasHours ? 11 : 14, hasHours ? 8 : 5);
    }

    setDecibelRange(min: number, max: number): void {
        if (min >= max) {
            return;
        }

        this._analyserNodeMap.forEach(node => {
            // Set min max in acceptable order to prevent error
            if (max <= node.minDecibels) {
                node.minDecibels = min;
                node.maxDecibels = max;
            } else {
                node.maxDecibels = max;
                node.minDecibels = min;
            }
        });
    }

    setUpAmplitudes(): void {
        this._sampleCounts.forEach(sampleCount => {
            this._amplitudesMap.set(sampleCount, new Uint8Array(sampleCount));
        });

        this._oomphAmplitudes = this._amplitudesMap.get(this._sampleCounts[1]);
        this._maxOomphAmplitudeTotal = this._oomphAmplitudes.length * 255;
        this.oomph = { value: 0 };
    }

    setUp(audioElement: HTMLAudioElement): void {
        this._audioElement = audioElement;
        this._audioElement.addEventListener('durationchange', duration =>
            this._duration$.next(this._audioElement.duration)
        );
        this._audioElement.addEventListener('timeupdate', time =>
            this._currentTime$.next(this._audioElement.currentTime)
        );

        this._sourceNode = this._audioContext.createMediaElementSource(audioElement);
        this._sourceNode.connect(this._audioContext.destination);

        this._sampleCounts.forEach(sampleCount => {
            const node: AnalyserNode = this._audioContext.createAnalyser();
            this._sourceNode.connect(node);

            node.fftSize = sampleCount * (this._showLowerData ? 2 : 4);
            node.smoothingTimeConstant = this._smoothingTimeConstant;

            this._analyserNodeMap.set(sampleCount, node);
        });

        this._updateAmplitudes();
    }

    setActiveSource(source: Source): void {
        if (this.activeSource?.objectUrl) {
            this._unloadFileSource(this.activeSource);
        }

        this.activeSource = source;
        if (this.activeSource.file) {
            this._loadFileSource(this.activeSource);
        }
    }

    protected _onSourceAdded(source: Source): void {}

    private _updateAmplitudes(): void {
        this._ngZone.runOutsideAngular(() => {
            this._amplitudesMap.forEach((amplitudes, sampleCount) => {
                const node: AnalyserNode = this._analyserNodeMap.get(sampleCount);
                if (this.mode === 'frequency') {
                    node.getByteFrequencyData(amplitudes);
                } else {
                    node.getByteTimeDomainData(amplitudes);
                }
            });

            const total: number = this._oomphAmplitudes.reduce((prev, curr) => prev + curr);
            this.oomph.value = total / this._maxOomphAmplitudeTotal;

            requestAnimationFrame(() => this._updateAmplitudes());
        });
    }
}
