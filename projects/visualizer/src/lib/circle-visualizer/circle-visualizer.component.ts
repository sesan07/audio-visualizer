import { Component, Input, NgZone } from '@angular/core';
import { BaseVisualizerComponent } from '../base-visualizer/base-visualizer.component';
import { Color } from '../visualizer.types';
import { getGradientColor } from '../visualizer.utils';

@Component({
    selector: 'lib-circle-visualizer',
    templateUrl: './circle-visualizer.component.html',
    styleUrls: ['../base-visualizer/base-visualizer.component.scss']
})
export class CircleVisualizerComponent extends BaseVisualizerComponent {

    @Input() baseRadius: number;
    @Input() sampleRadius: number;

    private _centerX: number;
    private _centerY: number;
    private _sampleAngle: number;
    private _startAngle: number;

    private get _maxRadius(): number {
        return (this.baseRadius + this.sampleRadius + 255) * this.multiplier * this.scale;
    }

    constructor(ngZone: NgZone) {
        super(ngZone);
    }

    protected _animate(): void {
        this._canvasContext.clearRect(0, 0, this._canvasWidth, this._canvasHeight);

        let currAngle: number = this._startAngle;
        // Reverse to turn visualization upside down
        for (let i = 0; i < this.amplitudes.length; i++) {
            const amplitude: number = this.amplitudes[i];

            const radius: number = (this.baseRadius + amplitude) * this.multiplier * this.scale;
            const xLeft = this._centerX + radius * Math.cos(currAngle);
            const xRight = this._centerX - radius * Math.cos(currAngle);
            const y = this._centerY + radius * Math.sin(currAngle);
            currAngle += this._sampleAngle;

            // const gradientColor: Color = _getGradientColor(this._startColor, this._endColor, (i / this._amplitudes.length));
            const gradientColor: Color = getGradientColor(this._startColor, this._endColor, (amplitude / 255));

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

    protected _onSampleCountChanged(): void {
        this._sampleAngle = ((2 * Math.PI) / this.sampleCount) / 2;
        this._startAngle = (Math.PI / 2) + (this._sampleAngle / 2);
    }

    protected _onScaleChanged(): void {
        this._centerX = this._canvasWidth / 2;
        this._centerY = this._canvasHeight / 2;
    }

    private _drawPoint(x: number, y: number, color: Color): void {
        this._canvasContext.strokeStyle = '#00000055';
        this._canvasContext.fillStyle = `rgb(${color.red}, ${color.green}, ${color.blue})`;
        this._canvasContext.beginPath();
        this._canvasContext.arc(x, y, this.sampleRadius * this.scale, 0, 2 * Math.PI);
        this._canvasContext.stroke();
        this._canvasContext.fill();
    }
}
