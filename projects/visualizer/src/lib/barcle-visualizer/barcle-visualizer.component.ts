import { Component, Input, NgZone } from '@angular/core';
import { BaseVisualizerComponent } from '../base-visualizer/base-visualizer.component';
import { Color } from '../visualizer.types';
import { getGradientColor } from '../visualizer.utils';

@Component({
    selector: 'lib-barcle-visualizer',
    templateUrl: './barcle-visualizer.component.html',
    styleUrls: ['../base-visualizer/base-visualizer.component.scss']
})
export class BarcleVisualizerComponent extends BaseVisualizerComponent {
    @Input() baseRadius: number;

    private _centerX: number;
    private _centerY: number;
    private _sampleAngle: number;
    private _startAngle: number;

    private get _maxRadius(): number {
        return (this.baseRadius + 255) * this.multiplier * this.scale;
    }

    constructor(ngZone: NgZone) {
        super(ngZone);
    }

    protected _animate() {
        this._canvasContext.clearRect(0, 0, this._canvasWidth, this._canvasHeight);

        let currAngle: number = this._startAngle;
        // Reverse to turn visualization upside down
        for (let i = 0; i < this.amplitudes.length; i++) {
            const amplitude: number = this.amplitudes[i];
            if (amplitude === 0) {
                currAngle += this._sampleAngle;
                continue;
            }

            const radius: number = (this.baseRadius + amplitude) * this.multiplier * this.scale;
            const startAngle = currAngle - this._sampleAngle / 2;
            const endAngle = currAngle + this._sampleAngle / 2;
            const startAngle2 = Math.PI - currAngle - this._sampleAngle / 2;
            const endAngle2 = Math.PI - currAngle + this._sampleAngle / 2;
            currAngle += this._sampleAngle;

            // const gradientColor: Color = _getGradientColor(this._startColor, this._endColor, (i / this._amplitudes.length));
            const gradientColor: Color = getGradientColor(this._startColor, this._endColor, (amplitude / 255));

            this._drawBar(startAngle, endAngle, radius, gradientColor);
            this._drawBar(startAngle2, endAngle2, radius, gradientColor);
        }
        this._drawCap();
    }

    protected _getCanvasHeight(): number {
        return this._maxRadius * 2;
    }

    protected _getCanvasWidth(): number {
        return this._maxRadius * 2;
    }

    protected _onSampleCountChanged(): void {
        this._sampleAngle = ((2 * Math.PI) / this.sampleCount) / 2;
        this._startAngle = (Math.PI / 2) + (this._sampleAngle / 2);
    }

    protected _onScaleChanged(): void {
        this._centerX = this._canvasWidth / 2;
        this._centerY = this._canvasHeight / 2;
    }

    private _drawBar(startAngle: number, endAngle: number, height: number, color: Color): void {
        this._canvasContext.strokeStyle = '#00000055';
        this._canvasContext.fillStyle = `rgb(${color.red}, ${color.green}, ${color.blue})`;

        this._canvasContext.beginPath();
        this._canvasContext.arc(this._centerX, this._centerY, this.baseRadius * this.scale, startAngle, endAngle);
        this._canvasContext.arc(this._centerX, this._centerY, height, endAngle, startAngle, true);
        this._canvasContext.closePath();
        // this._canvasContext.stroke();
        this._canvasContext.fill();
    }

    private _drawCap(): void {
        this._canvasContext.strokeStyle = '#00000055';
        this._canvasContext.fillStyle = `rgb(${this._startColor.red}, ${this._startColor.green}, ${this._startColor.blue})`;
        this._canvasContext.beginPath();
        this._canvasContext.arc(this._centerX, this._centerY, this.baseRadius * this.scale, 0, 2 * Math.PI);
        // this._canvasContext.stroke();
        this._canvasContext.fill();
    }
}
