import { Component, Input, NgZone, OnChanges, SimpleChanges } from '@angular/core';
import { BaseVisualizerComponent } from '../base-visualizer/base-visualizer.component';
import { getGradientColor } from '../visualizer-entity.utils';
import { RGB } from 'ngx-color';

@Component({
    selector: 'lib-barcle-visualizer',
    templateUrl: './barcle-visualizer.component.html',
    styleUrls: ['../base-visualizer/base-visualizer.component.scss']
})
export class BarcleVisualizerComponent extends BaseVisualizerComponent implements OnChanges {
    @Input() baseRadius: number;
    @Input() fillCenter: boolean;

    private _centerX: number;
    private _centerY: number;
    private _sampleAngle: number;
    private _startAngle: number;
    private readonly _ringSize = 20;

    private get _maxRadius(): number {
        return (this.multiplier * 255 + this.baseRadius + this._ringSize) * (this.scale + this.oomphAmount);
    }

    constructor(ngZone: NgZone) {
        super(ngZone);
    }

    ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);

        if (changes.baseRadius && !changes.baseRadius.firstChange) {
            this._updateDimensions();
        }
    }

    protected _animate() {
        this._canvasContext.clearRect(0, 0, this._canvasWidth, this._canvasHeight);

        let currAngle: number = this._startAngle;
        // Reverse to turn visualization upside down
        for (let i = 0; i < this.amplitudes.length; i++) {
            const amplitude: number = this.amplitudes[i];
            const radius: number = (this.baseRadius + this._ringSize + amplitude * this.multiplier) * this._oomphScale;
            const startAngle = currAngle - this._sampleAngle / 2;
            const endAngle = currAngle + this._sampleAngle / 2;
            const startAngle2 = Math.PI - currAngle - this._sampleAngle / 2;
            const endAngle2 = Math.PI - currAngle + this._sampleAngle / 2;
            currAngle += this._sampleAngle;

            // const gradientColor: Color = _getGradientColor(this._startColor, this._endColor, (i / this._amplitudes.length));
            const gradientColor: RGB = getGradientColor(this._startColor, this._endColor, (amplitude / 255));

            this._drawBar(startAngle, endAngle, radius, gradientColor);
            this._drawBar(startAngle2, endAngle2, radius, gradientColor);
        }
        if (this.fillCenter) {
            this._drawCap();
        }
    }

    protected _getCanvasHeight(): number {
        return this._maxRadius * 2;
    }

    protected _getCanvasWidth(): number {
        return this._maxRadius * 2;
    }

    protected _onDimensionsChanged(): void {
        this._sampleAngle = ((2 * Math.PI) / this.sampleCount) / 2;
        this._startAngle = (Math.PI / 2) + (this._sampleAngle / 2);
        this._centerX = this._canvasWidth / 2;
        this._centerY = this._canvasHeight / 2;
    }

    private _drawBar(startAngle: number, endAngle: number, height: number, color: RGB): void {
        this._canvasContext.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;

        this._canvasContext.beginPath();
        this._canvasContext.arc(this._centerX, this._centerY, this.baseRadius * this._oomphScale, startAngle, endAngle);
        this._canvasContext.arc(this._centerX, this._centerY, height, endAngle, startAngle, true);
        this._canvasContext.closePath();
        this._canvasContext.fill();
    }

    private _drawCap(): void {
        this._canvasContext.fillStyle = this.startColorHex;
        this._canvasContext.beginPath();
        this._canvasContext.arc(this._centerX, this._centerY, this.baseRadius * this._oomphScale, 0, 2 * Math.PI);
        this._canvasContext.fill();
    }
}
