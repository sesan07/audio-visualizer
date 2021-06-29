import { Component, Input, NgZone } from '@angular/core';
import { BaseVisualizerComponent } from '../base-visualizer/base-visualizer.component';
import { Color } from '../visualizer.types';
import { convertColorToHex, getGradientColor } from '../visualizer.utils';
import { CircleEffect } from './circle-visualizer.types';

@Component({
    selector: 'lib-circle-visualizer',
    templateUrl: './circle-visualizer.component.html',
    styleUrls: ['../base-visualizer/base-visualizer.component.scss']
})
export class CircleVisualizerComponent extends BaseVisualizerComponent {

    @Input() baseRadius: number;
    @Input() sampleRadius: number;
    @Input() effect: CircleEffect = CircleEffect.DEFAULT;

    protected _canvasHeight: number;
    protected _canvasWidth: number;

    private _centerX: number;
    private _centerY: number;
    private _sampleAngle: number;
    private _startAngle: number;

    private get _maxRadius(): number {
        return (this.baseRadius + this.sampleRadius + 255) * this.oomph * this.scale;
    }

    constructor(protected ngZone: NgZone) {
        super();
    }

    protected _animate(): void {
        this.ngZone.runOutsideAngular(() => {
            this._canvasContext.clearRect(0, 0, this._canvasWidth, this._canvasHeight);

            let currAngle: number = this._startAngle;
            // Reverse to turn visualization upside down
            for (let i = 0; i < this._amplitudes.length; i++) {
                const amplitude: number = this._amplitudes[i];

                const radius: number = (this.baseRadius + amplitude) * this.oomph * this.scale;
                const xLeft = this._centerX + radius * Math.cos(currAngle);
                const xRight = this._centerX - radius * Math.cos(currAngle);
                const y = this._centerY + radius * Math.sin(currAngle);
                currAngle += this._sampleAngle;

                // const gradientColor: Color = _getGradientColor(this._startColor, this._endColor, (i / this._amplitudes.length));
                const gradientColor: Color = getGradientColor(this._startColor, this._endColor, (amplitude / 255));
                const color = convertColorToHex(gradientColor);

                this._drawPoint(xLeft, y, color);
                if (this.effect === CircleEffect.DEFAULT) {
                    this._drawPoint(xRight, y, color);
                }
            }
        });
    }

    protected _getCanvasHeight(): number {
        return this._maxRadius * 2;
    }

    protected _getCanvasWidth(): number {
        return this._maxRadius * 2;
    }

    protected _onSampleCountChanged(): void {
        switch (this.effect) {
            case CircleEffect.DEFAULT:
                this._sampleAngle = ((2 * Math.PI) / this.sampleCount) / 2;
                this._startAngle = (Math.PI / 2) + (this._sampleAngle / 2);
                break;
            case CircleEffect.SPIRAL:
                this._sampleAngle = (360 / this.sampleCount) / 2;
                this._startAngle = 0;
                break;
            default:
                throw new Error('Unsupported circle effect');
        }
    }

    protected _onScaleChanged(): void {
        this._centerX = this._canvasWidth / 2;
        this._centerY = this._canvasHeight / 2;
    }

    private _drawPoint(x: number, y: number, colorHex: string): void {
        this._canvasContext.strokeStyle = '#00000055';
        this._canvasContext.fillStyle = colorHex;
        this._canvasContext.beginPath();
        this._canvasContext.arc(x, y, this.sampleRadius * this.scale, 0, 2 * Math.PI);
        this._canvasContext.stroke();
        this._canvasContext.fill();
    }
}
