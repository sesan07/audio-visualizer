import { Injectable } from '@angular/core';
import { VisualizerModule } from './visualizer.module';
import { Observable, Subject } from 'rxjs';
import { VisualizerMode } from './visualizer.types';

@Injectable({
    providedIn: VisualizerModule
})
export class VisualizerService {

    get audioElement(): HTMLAudioElement {
        return this._audioElement;
    }

    set audioElement(el: HTMLAudioElement) {
        this._audioElement = el;
        if (this._sourceNode) {
            this._reset();
        }
    }

    setMinMax(min: number, max: number): void {
        this._minDecibels = min;
        this._maxDecibels = max;
        if (this._analyzerNode) {
            this._updateAnalyzer();
        }
    }

    get sampleCount(): number {
        return this._sampleCount;
    }

    set sampleCount(v: number) {
        this._sampleCount = v;
        if (this._analyzerNode) {
            this._updateAnalyzer();
        }
        this._sampleCountSubject.next(v);
    }

    get mode(): VisualizerMode {
        return this._mode;
    }

    set mode(v: VisualizerMode) {
        this._mode = v;
        if (this._analyzerNode) {
            this._updateAnalyzer();
        }
    }

    get showLowerData(): boolean {
        return this._showLowerData;
    }

    set showLowerData(v: boolean) {
        this._showLowerData = v;
        if (this._analyzerNode) {
            this._updateAnalyzer();
        }
    }

    private _amplitudesSubject: Subject<Uint8Array> = new Subject();
    private _sampleCountSubject: Subject<number> = new Subject();

    get amplitudesChange(): Observable<Uint8Array> {
        return this._amplitudesSubject.asObservable();
    }

    get sampleCountChange(): Observable<number> {
        return this._sampleCountSubject.asObservable();
    }

    private _audioElement: HTMLAudioElement;
    private _mode: VisualizerMode = 'frequency';
    private _sampleCount: number = 32;
    private _minDecibels: number = -80;
    private _maxDecibels: number = -20;
    private _showLowerData: boolean = false;

    private _audioContext: AudioContext = new AudioContext();
    private _sourceNode: MediaElementAudioSourceNode;

    private _amplitudes: Uint8Array;
    private _analyzerNode: AnalyserNode;

    public start(): void {
        this._reset();
        this._animate();
    }

    private _reset(): void {
        this._sourceNode?.disconnect();
        this._sourceNode = this._audioContext.createMediaElementSource(this._audioElement);
        this._analyzerNode = this._audioContext.createAnalyser();
        this._updateAnalyzer();
        this._sourceNode.connect(this._audioContext.destination);
        this._sourceNode.connect(this._analyzerNode);
    }

    private _updateAnalyzer(): void {
        this._analyzerNode.fftSize = this._sampleCount * (this._showLowerData ? 2 : 4);
        this._analyzerNode.smoothingTimeConstant = 0.7;
        this._analyzerNode.maxDecibels = this._maxDecibels;
        this._analyzerNode.minDecibels = this._minDecibels;
        this._amplitudes = new Uint8Array(this._sampleCount);
    }

    private _animate(): void {
        if (this._mode === 'frequency') {
            this._analyzerNode.getByteFrequencyData(this._amplitudes);
        } else {
            this._analyzerNode.getByteTimeDomainData(this._amplitudes);
        }
        this._amplitudesSubject.next(this._amplitudes);
        requestAnimationFrame(() => this._animate());
    }
}
