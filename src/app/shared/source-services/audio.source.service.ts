import { Injectable, NgZone } from '@angular/core';
import { AnalyserMode, Oomph } from './audio.source.service.types';
import { DomSanitizer } from '@angular/platform-browser';
import { BaseSourceService } from './base.source.service';
import { Source } from './base.source.service.types';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AudioSourceService extends BaseSourceService {
    override sources: Source[] = [{ name: 'Default', src: 'assets/audio/default.mp3' }];

    mode: AnalyserMode = 'frequency';
    oomph: Oomph = { value: 0 };
    sampleCounts: number[] = [8, 16, 32, 64, 128, 256, 512];
    amplitudesMap: Record<string, Uint8Array> = {};

    isPlaying$: Observable<boolean>;
    duration$: Observable<number>;
    currentTime$: Observable<number>;

    private _isPlaying$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    private _duration$: BehaviorSubject<number> = new BehaviorSubject(0);
    private _currentTime$: BehaviorSubject<number> = new BehaviorSubject(0);

    private _audioContext: AudioContext = new AudioContext();
    private _audioElement?: HTMLAudioElement;
    private _sourceNode?: MediaElementAudioSourceNode;
    private _analyserNodeMap: Map<string, AnalyserNode> = new Map();
    private _oomphAmplitudes: Uint8Array = new Uint8Array();
    private _maxOomphAmplitudeTotal: number = 1;
    private readonly _showLowerData: boolean = false;
    private readonly _smoothingTimeConstant: number = 0.2;

    public testing: Subject<void> = new Subject();

    private _start?: number;
    private _prev: number = Date.now();
    private _max: number = 0;
    private _min: number = Number.MAX_SAFE_INTEGER;

    constructor(private _ngZone: NgZone, sanitizer: DomSanitizer, messageService: NzMessageService) {
        super(sanitizer, messageService);

        this.isPlaying$ = this._isPlaying$.asObservable();
        this.duration$ = this._duration$.asObservable();
        this.currentTime$ = this._currentTime$.asObservable();

        this.setUpAmplitudes();
    }

    togglePlay(): void {
        if (this._audioElement?.paused) {
            this.play();
        } else {
            this.pause();
        }
    }

    setCurrentTime(val: number): void {
        if (this._audioElement) {
            this._audioElement.currentTime = val;
        }
    }

    // getAmplitudes(sampleCount: number): Uint8Array {
    //     return this.amplitudesMap[sampleCount] ?? new Uint8Array();
    // }

    play(): void {
        if (!this._audioElement) {
            return;
        }

        if (this._audioContext.state !== 'running') {
            this._audioContext.resume().then(() => {
                if (this._audioElement) {
                    this._audioElement.play();
                }
            });
        } else {
            this._audioElement.play();
        }
        this._isPlaying$.next(true);
    }

    pause(): void {
        if (this._audioElement) {
            this._audioElement.pause();
            this._isPlaying$.next(false);
        }
    }

    previous(): void {
        if (!this.activeSource || !this._audioElement) {
            return;
        }

        const currIndex: number = this.sources.indexOf(this.activeSource);
        if (currIndex - 1 >= 0) {
            this.setActiveSource(this.sources[currIndex - 1]);
            setTimeout(() => this.play());
        } else {
            this._audioElement.currentTime = 0;
            setTimeout(() => this.play());
        }
    }

    next(): void {
        if (!this.activeSource) {
            return;
        }

        const currIndex: number = this.sources.indexOf(this.activeSource);
        if (currIndex + 1 < this.sources.length) {
            this.setActiveSource(this.sources[currIndex + 1]);
            setTimeout(() => this.play());
        } else if (this._audioElement?.ended) {
            this._isPlaying$.next(false);
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
        this.sampleCounts.forEach(sampleCount => {
            this.amplitudesMap[sampleCount] = new Uint8Array(sampleCount);
        });

        this._oomphAmplitudes = this.amplitudesMap[this.sampleCounts[1]] ?? new Uint8Array();
        this._maxOomphAmplitudeTotal = this._oomphAmplitudes.length * 255;
        this.oomph = { value: 0 };
    }

    setUp(audioElement: HTMLAudioElement): void {
        // console.log((audioElement as HTMLMediaElement).controlsList);
        this._audioElement = audioElement;
        this._audioElement.addEventListener('durationchange', duration =>
            this._duration$.next(this._audioElement!.duration)
        );
        this._audioElement.addEventListener('timeupdate', time =>
            this._currentTime$.next(this._audioElement!.currentTime)
        );

        this._sourceNode = this._audioContext.createMediaElementSource(audioElement);
        this._sourceNode.connect(this._audioContext.destination);

        this.sampleCounts.forEach(sampleCount => {
            const node: AnalyserNode = this._audioContext.createAnalyser();
            node.fftSize = sampleCount * (this._showLowerData ? 2 : 4);
            node.smoothingTimeConstant = this._smoothingTimeConstant;

            this._sourceNode!.connect(node);
            this._analyserNodeMap.set(sampleCount + '', node);
        });

        this._ngZone.runOutsideAngular(() => this._updateAmplitudes());
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
        // console.log('0', NgZone.isInAngularZone());
        Object.entries(this.amplitudesMap).forEach(([sampleCount, amplitudes]) => {
            const node: AnalyserNode = this._analyserNodeMap.get(sampleCount)!;
            if (this.mode === 'frequency') {
                node.getByteFrequencyData(amplitudes);
            } else {
                node.getByteTimeDomainData(amplitudes);
            }
        });

        const total: number = this._oomphAmplitudes.reduce((prev, curr) => prev + curr);
        this.oomph.value = total / this._maxOomphAmplitudeTotal;

        requestAnimationFrame(() => this._updateAmplitudes());
    }
}
