import { AfterViewInit, Component, ElementRef, Input, NgZone, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Color, IAudioConfig, VisualizerMode } from '../visualizer.types';
import { convertHexToColor, convertColorToHex, getRandomColor } from '../visualizer.utils';

@Component({
    template: ''
})
export abstract class BaseVisualizerComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {

    @Input() amplitudes: Uint8Array;
    @Input() animationStopTime: number = 0;
    @Input() audioConfig: IAudioConfig;
    @Input() endColorHex?: string;
    @Input() oomph: number;
    @Input() scale: number;
    @Input() shadowBlur: number = 0;
    @Input() startColorHex?: string;

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

    @Input() set sampleCount(v: number) {
        this._sampleCount = v;
    }
    get sampleCount(): number {
        return this._sampleCount ?? 128;
    }

    @ViewChild('canvasElement') canvasElement: ElementRef<HTMLCanvasElement>;

    protected _canvasContext: CanvasRenderingContext2D;
    protected _canvasHeight: number;
    protected _canvasWidth: number;
    protected _startColor: Color;
    protected _endColor: Color;

    private _maxDecibels: number;
    private _minDecibels: number;
    private _mode: VisualizerMode;
    private _sampleCount: number;
    private _showLowerData: boolean;

    private _animationFrameId: number;

    protected constructor(private _ngZone: NgZone) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if ((changes.scale && !changes.scale.firstChange) || (changes.oomph && !changes.oomph.firstChange)) {
            this._setCanvasDimensions();
            this._onScaleChanged();
            this._setUpCanvas();
        }
        if (changes.sampleCount && !changes.sampleCount.firstChange) {
            this._setCanvasDimensions();
            this._onSampleCountChanged()
            this._setUpCanvas();
        }
        if (changes.shadowBlur && !changes.shadowBlur.firstChange) {
            this._canvasContext.shadowBlur = this.shadowBlur;
        }
    }

    ngOnInit(): void {
        this._startColor = this.startColorHex ? convertHexToColor(this.startColorHex) : getRandomColor();
        this._endColor = this.endColorHex ? convertHexToColor(this.endColorHex) : getRandomColor();

        this._setCanvasDimensions();
        this._onScaleChanged();
        this._onSampleCountChanged();
    }

    ngAfterViewInit(): void {
        this._setUpCanvas();
        this._baseAnimate();
    }

    ngOnDestroy(): void {
        // Stop animation
        if (this._animationFrameId) {
            if (this.animationStopTime > 0) {
                // Stop after some time
                // Useful if the component is still visible for some time after destruction
                setTimeout(() => {
                    cancelAnimationFrame(this._animationFrameId)
                }, this.animationStopTime)
            } else {
                // Stop immediately
                cancelAnimationFrame(this._animationFrameId)
            }
        }
    }

    protected _setCanvasDimensions(): void {
        this._canvasHeight = this._getCanvasHeight();
        this._canvasWidth = this._getCanvasWidth();
    }

    private _setUpCanvas(): void {
        this.canvasElement.nativeElement.width = this._canvasWidth;
        this.canvasElement.nativeElement.height = this._canvasHeight;
        this._canvasContext = this.canvasElement.nativeElement.getContext('2d');
        this._canvasContext.shadowColor = convertColorToHex(this._startColor)
        this._canvasContext.shadowBlur = this.shadowBlur
    }

    private _baseAnimate(): void {
        this._ngZone.runOutsideAngular(() => {
            this._animate()
            this._animationFrameId = requestAnimationFrame(() => this._baseAnimate());
        });
    }

    protected abstract _animate(): void;

    protected abstract _getCanvasHeight(): number;

    protected abstract _getCanvasWidth(): number;

    protected abstract _onSampleCountChanged(): void;

    protected abstract _onScaleChanged(): void;
}
