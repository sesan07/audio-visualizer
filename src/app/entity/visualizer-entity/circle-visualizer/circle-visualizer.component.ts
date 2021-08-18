import { Component, Input, NgZone, OnChanges, SimpleChanges } from '@angular/core';
import { BaseVisualizerComponent } from '../base-visualizer/base-visualizer.component';
import { getGradientColor } from '../visualizer-entity.utils';
import { RGB } from 'ngx-color';

@Component({
    selector: 'lib-circle-visualizer',
    templateUrl: './circle-visualizer.component.html',
    styleUrls: ['../base-visualizer/base-visualizer.component.scss']
})
export class CircleVisualizerComponent extends BaseVisualizerComponent implements OnChanges {

    @Input() baseRadius: number;
    @Input() sampleRadius: number;

    private _centerX: number;
    private _centerY: number;
    private _sampleAngle: number;
    private _startAngle: number;

    private get _maxRadius(): number {
        return (this.multiplier * 255 + this.baseRadius + this.sampleRadius) * (this.scale + this.oomphAmount);
    }

    constructor(ngZone: NgZone) {
        super(ngZone);
    }

    ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);

        if ((changes.baseRadius && !changes.baseRadius.firstChange)
            || (changes.sampleRadius && !changes.sampleRadius.firstChange)) {

            this._updateDimensions();
        }
    }

    protected _animate(): void {
        this._canvasContext.clearRect(0, 0, this._canvasWidth, this._canvasHeight);

        let currAngle: number = this._startAngle;
        // Reverse to turn visualization upside down
        for (let i = 0; i < this.amplitudes.length; i++) {
            const amplitude: number = this.amplitudes[i];

            const radius: number = (this.baseRadius + amplitude * this.multiplier) * this._oomphScale;
            const xLeft = this._centerX + radius * Math.cos(currAngle);
            const xRight = this._centerX - radius * Math.cos(currAngle);
            const y = this._centerY + radius * Math.sin(currAngle);
            currAngle += this._sampleAngle;

            // const gradientColor: Color = _getGradientColor(this._startColor, this._endColor, (i / this._amplitudes.length));
            const gradientColor: RGB = getGradientColor(this._startColor, this._endColor, (amplitude / 255));

            this._drawPoint(xLeft, y, gradientColor);
            this._drawPoint(xRight, y, gradientColor);
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

    private _drawPoint(x: number, y: number, color: RGB): void {
        this._canvasContext.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
        this._canvasContext.beginPath();
        this._canvasContext.arc(x, y, this.sampleRadius * this._oomphScale, 0, 2 * Math.PI);
        this._canvasContext.fill();
    }
}
