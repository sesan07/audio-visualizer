import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Color, IAudioConfig, VisualizerMode } from '../visualizer.types';
import { _convertHexToColor } from '../visualizer.utils';
import { Subject } from 'rxjs';

@Component({
    template: ''
})
export abstract class BaseVisualizerComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {

    @Input() analyserNode: AnalyserNode;
    @Input() audioConfig: IAudioConfig;
    @Input() endColorHex: string;
    @Input() oomph: number;
    @Input() scale: number;
    @Input() startColorHex: string;

    @Input() set maxDecibels(v: number) {
        this._maxDecibels = v;
    }
    get maxDecibels(): number {
        return this._maxDecibels ?? -20;
    }

    @Input() set minDecibels(v: number) {
        this._minDecibels = v;
    }
    get minDecibels(): number {
        return this._minDecibels ?? -80;
    }

    @Input() set mode(v: VisualizerMode) {
        this._mode = v;
    }
    get mode(): VisualizerMode {
        return this._mode ?? 'frequency';
    }

    @Input() set sampleCount(v: number) {
        this._sampleCount = v;
    }
    get sampleCount(): number {
        return this._sampleCount ?? 128;
    }

    @Input() set showLowerData(v: boolean) {
        this._showLowerData = v;
    }
    get showLowerData(): boolean {
        return !!this._showLowerData;
    }

    @ViewChild('canvasElement') canvasElement: ElementRef<HTMLCanvasElement>;

    protected _canvasContext: CanvasRenderingContext2D;
    protected _canvasHeight: number;
    protected _canvasWidth: number;
    protected _startColor: Color;
    protected _endColor: Color;
    protected _amplitudes: Uint8Array;

    private _maxDecibels: number;
    private _minDecibels: number;
    private _mode: VisualizerMode;
    private _sampleCount: number;
    private _showLowerData: boolean;
    private _destroy$: Subject<void> = new Subject();

    ngOnChanges(changes: SimpleChanges): void {
        if ((changes.scale && !changes.scale?.firstChange) || (changes.oomph && !changes.oomph.firstChange)) {
            this._setCanvasDimensions();
            this._onScaleChanged();
            this._setUpCanvas();
        }
        if (changes.sampleCount && !changes.sampleCount.firstChange) {
            this._setCanvasDimensions();
            this._setUpAnalyser();
            this._onSampleCountChanged()
            this._setUpCanvas();
        }
    }

    ngOnInit(): void {
        this._startColor = _convertHexToColor(this.startColorHex);
        this._endColor = _convertHexToColor(this.endColorHex);

        this._setUpAnalyser();
        this._setCanvasDimensions();
        this._onScaleChanged();
        this._onSampleCountChanged();
    }

    ngAfterViewInit(): void {
        this._setUpCanvas();
        this._baseAnimate();
    }

    ngOnDestroy(): void {
        this._destroy$.next();
        this._destroy$.complete();
        this.analyserNode.disconnect();
    }

    protected _setCanvasDimensions(): void {
        this._canvasHeight = this._getCanvasHeight();
        this._canvasWidth = this._getCanvasWidth();
    }

    protected _setUpAnalyser(): void {
        this.analyserNode.fftSize = this.sampleCount * (this.showLowerData ? 2 : 4);
        this.analyserNode.smoothingTimeConstant = 0.7;
        this.analyserNode.maxDecibels = this.maxDecibels;
        this.analyserNode.minDecibels = this.minDecibels;
        this._amplitudes = new Uint8Array(this.sampleCount);
    }

    private _setUpCanvas(): void {
        this._canvasContext = this.canvasElement.nativeElement.getContext('2d');
        this.canvasElement.nativeElement.width = this._canvasWidth;
        this.canvasElement.nativeElement.height = this._canvasHeight;
    }

    private _baseAnimate(): void {
        if (this.mode === 'frequency') {
            this.analyserNode.getByteFrequencyData(this._amplitudes);
        } else {
            this.analyserNode.getByteTimeDomainData(this._amplitudes);
        }
        this._animate()
        requestAnimationFrame(() => this._baseAnimate());
    }

    protected abstract _animate(): void;

    protected abstract _getCanvasHeight(): number;

    protected abstract _getCanvasWidth(): number;

    protected abstract _onSampleCountChanged(): void;

    protected abstract _onScaleChanged(): void;
}
