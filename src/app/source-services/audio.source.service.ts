import { Injectable, NgZone } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { NzMessageService } from 'ng-zorro-antd/message';
import { BehaviorSubject, Observable } from 'rxjs';

import { AnalyserMode, Oomph } from './audio.source.service.types';
import { BaseSourceService } from './base.source.service';
import { Source } from './base.source.service.types';

@Injectable({
    providedIn: 'root',
})
export class AudioSourceService extends BaseSourceService {
    override sources: Source[] = [{ name: 'Intro', src: 'assets/audio/default.mp3' }];

    modeOptions: { name: string; value: string }[] = [
        {
            name: 'Frequency',
            value: 'frequency',
        },
        {
            name: 'Time Domain',
            value: 'timeDomain',
        },
    ];

    mode: AnalyserMode = 'frequency';
    oomph: Oomph = { value: 0 };
    sampleCounts: number[] = [8, 16, 32, 64, 128, 256, 512];
    amplitudesMap: Record<string, Uint8Array> = {};

    isPlaying$: Observable<boolean>;
    duration$: Observable<number>;
    currentTime$: Observable<number>;
    volume$: Observable<number>;
    muted$: Observable<boolean>;

    private _isPlaying$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    private _duration$: BehaviorSubject<number> = new BehaviorSubject(0);
    private _currentTime$: BehaviorSubject<number> = new BehaviorSubject(0);
    private _volume$: BehaviorSubject<number> = new BehaviorSubject(0.3);
    private _muted$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    private _audioContext: AudioContext = new AudioContext();
    private _audioElement?: HTMLAudioElement;
    private _sourceNode?: MediaElementAudioSourceNode;
    private _analyserNodeMap: Map<string, AnalyserNode> = new Map();
    private _maxOomphAmplitudeTotal!: number;

    private _oomphNode!: AnalyserNode;
    private _oomphAmplitudes!: Uint8Array;

    private readonly _SHOW_LOWER_DATA: boolean = false;
    private readonly _SMOOTHING_TIME_CONSTANT: number = 0.8;
    private readonly _DEFAULT_DECIBEL_MIN: number = -80;
    private readonly _DEFAULT_DECIBEL_MAX: number = -20;
    private readonly _OOMPH_TOTAL_SAMPLE_COUNT: number = 256;
    private readonly _OOMPH_SAMPLE_COUNT: number = 2;
    private readonly _OOMPH_SMOOTHING_TIME_CONSTANT: number = 0.85;

    constructor(private _ngZone: NgZone, sanitizer: DomSanitizer, messageService: NzMessageService) {
        super(sanitizer, messageService);

        this.isPlaying$ = this._isPlaying$.asObservable();
        this.duration$ = this._duration$.asObservable();
        this.currentTime$ = this._currentTime$.asObservable();
        this.volume$ = this._volume$.asObservable();
        this.muted$ = this._muted$.asObservable();

        this.setUpOomph();
        this.setUpAmplitudes();
        this.setActiveSource(this.sources[0]);
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
            this._currentTime$.next(val);
            this._audioElement.currentTime = val;
        }
    }

    setVolume(val: number): void {
        if (this._audioElement) {
            this._volume$.next(val);
            this._audioElement.volume = val;
        }
    }

    toggleMuted(): void {
        this._setMuted(!this._muted$.value);
    }

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
        this._setMuted(false);
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

        this._oomphAmplitudes = new Uint8Array(this._OOMPH_TOTAL_SAMPLE_COUNT);
        this._maxOomphAmplitudeTotal = this._OOMPH_SAMPLE_COUNT * 255;
    }

    setUpOomph(): void {
        this._oomphNode = this._audioContext.createAnalyser();
        this._oomphNode.fftSize = this._OOMPH_TOTAL_SAMPLE_COUNT * 4;
        this._oomphNode.smoothingTimeConstant = this._OOMPH_SMOOTHING_TIME_CONSTANT;
        this._oomphNode.minDecibels = -60;
        this._oomphNode.maxDecibels = -20;
    }

    setUp(audioElement: HTMLAudioElement): void {
        this._audioElement = audioElement;
        this._audioElement.addEventListener('durationchange', () => this._duration$.next(this._audioElement!.duration));
        this._audioElement.addEventListener('timeupdate', () =>
            this._currentTime$.next(this._audioElement!.currentTime)
        );
        this._audioElement.volume = this._volume$.value;

        this._sourceNode = this._audioContext.createMediaElementSource(audioElement);
        this._sourceNode.connect(this._audioContext.destination);
        this._sourceNode.connect(this._oomphNode);

        this.sampleCounts.forEach(sampleCount => {
            const node: AnalyserNode = this._audioContext.createAnalyser();
            node.fftSize = sampleCount * (this._SHOW_LOWER_DATA ? 2 : 4);
            node.smoothingTimeConstant = this._SMOOTHING_TIME_CONSTANT;
            node.minDecibels = this._DEFAULT_DECIBEL_MIN;
            node.maxDecibels = this._DEFAULT_DECIBEL_MAX;

            this._sourceNode!.connect(node);
            this._analyserNodeMap.set(sampleCount + '', node);
        });

        this._ngZone.runOutsideAngular(() => this._updateAmplitudes());
    }

    setActiveSource(source: Source, playSource?: boolean): void {
        if (this.activeSource?.objectUrl) {
            this._unloadFileSource(this.activeSource);
        }

        this.activeSource = source;
        if (this.activeSource.file) {
            this._loadFileSource(this.activeSource);
        }
        if (playSource) {
            setTimeout(() => this.play());
        }
    }

    protected _onSourceAdded(source: Source): void {}

    private _updateAmplitudes(): void {
        Object.entries(this.amplitudesMap).forEach(([sampleCount, amplitudes]) => {
            const node: AnalyserNode = this._analyserNodeMap.get(sampleCount)!;
            if (this.mode === 'frequency') {
                node.getByteFrequencyData(amplitudes);
            } else {
                node.getByteTimeDomainData(amplitudes);
            }
        });

        this._oomphNode.getByteFrequencyData(this._oomphAmplitudes);
        let total: number = 0;
        for (let i: number = 0; i < this._OOMPH_SAMPLE_COUNT; i++) {
            total += this._oomphAmplitudes[i];
        }
        this.oomph.value = total / this._maxOomphAmplitudeTotal;

        requestAnimationFrame(() => this._updateAmplitudes());
    }

    private _setMuted(val: boolean): void {
        if (this._audioElement) {
            this._muted$.next(val);
            this._audioElement.muted = val;
        }
    }
}
