import { AfterViewInit, Component, ElementRef, Input, NgZone, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';
import { convertHexToColor } from '../visualizer-entity.utils';
import { IOomph } from '../../../shared/audio-service/audio.service.types';
import { RGB } from 'ngx-color';

@Component({
    template: ''
})
export abstract class BaseVisualizerComponent implements OnChanges, AfterViewInit, OnDestroy {
    @Input() amplitudes: Uint8Array;
    @Input() oomph: IOomph;
    @Input() oomphAmount: number;
    @Input() animationStopTime: number = 0;
    @Input() endColorHex: string;
    @Input() multiplier: number;
    @Input() sampleCount: number;
    @Input() scale: number;
    @Input() shadowBlur: number = 0;
    @Input() startColorHex: string;

    @ViewChild('canvasElement') canvasElement: ElementRef<HTMLCanvasElement>;

    protected _canvasContext: CanvasRenderingContext2D;
    protected _canvasHeight: number;
    protected _canvasWidth: number;
    protected readonly _canvasPadding: number = 20; // used to reduce the hard cut off of shadow blur on the sides
    protected _startColor: RGB;
    protected _endColor: RGB;
    protected _oomphScale: number; // Scale with oomph applied

    private _animationFrameId: number;

    protected constructor(private _ngZone: NgZone) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if ((changes.scale && !changes.scale.firstChange)
            || (changes.multiplier && !changes.multiplier.firstChange)
            || (changes.sampleCount && !changes.sampleCount.firstChange)
            || (changes.oomphAmount && !changes.oomphAmount.firstChange)) {

            this._updateDimensions();
        }
        if (changes.shadowBlur && !changes.shadowBlur.firstChange) {
            this._canvasContext.shadowBlur = this.shadowBlur;
        }
        if (changes.startColorHex) {
            this._startColor = convertHexToColor(this.startColorHex);
            if (!changes.startColorHex.firstChange) {
                this._canvasContext.shadowColor = this.startColorHex;
            }
        }
        if (changes.endColorHex) {
            this._endColor = convertHexToColor(this.endColorHex);
        }
    }

    ngAfterViewInit(): void {
        this._updateDimensions();
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

    protected _updateDimensions(): void {
        this._setUpCanvas();
        this._onDimensionsChanged();
    }

    private _setUpCanvas(): void {
        this._canvasHeight = this._getCanvasHeight() + this._canvasPadding * 2; // add space to the sides of the canvas
        this._canvasWidth = this._getCanvasWidth() + this._canvasPadding * 2; // add space to the sides of the canvas

        this.canvasElement.nativeElement.width = this._canvasWidth;
        this.canvasElement.nativeElement.height = this._canvasHeight;

        this._canvasContext = this.canvasElement.nativeElement.getContext('2d');
        this._canvasContext.shadowColor = this.startColorHex;
        this._canvasContext.shadowBlur = this.shadowBlur
    }

    private _baseAnimate(): void {
        this._ngZone.runOutsideAngular(() => {
            this._updateOomphScale();
            this._animate()
            this._animationFrameId = requestAnimationFrame(() => this._baseAnimate());
        });
    }

    private _updateOomphScale(): void {
        this._oomphScale = this.scale;
        const scale: number = (this.oomph.amplitudeTotal / this.oomph.maxAmplitudeTotal) * this.oomphAmount;
        this._oomphScale += scale;
    }

    protected abstract _animate(): void;

    protected abstract _getCanvasHeight(): number;

    protected abstract _getCanvasWidth(): number;

    protected abstract _onDimensionsChanged(): void;
}
