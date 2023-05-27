import { Entity } from '../../app.types';
import { getGradientColor, getRadians } from '../../shared/utils';
import { BaseContentAnimator } from '../base/base.content-animator';
import { RGB } from 'ngx-color';
import { CircleContent } from './circle.content.types';

export class CircleContentAnimator extends BaseContentAnimator<CircleContent> {
    protected _animateContent(
        { content, opacity }: Entity<CircleContent>,
        canvasContext: CanvasRenderingContext2D
    ): void {
        canvasContext.globalAlpha = opacity.current;
        const strokeColor: string = `rgb(${content.startColor.r}, ${content.startColor.g}, ${content.startColor.b})`;
        canvasContext.shadowBlur = content.shadowBlur;
        canvasContext.shadowColor = strokeColor;
        canvasContext.strokeStyle = strokeColor;

        const amplitudes: Uint8Array = this._amplitudesMap[content.sampleCount];
        const sampleAngle: number = getRadians(360) / content.sampleCount / 2;
        let currAngle: number = getRadians(90) + sampleAngle / 2;
        // Reverse to turn visualization upside down
        for (let i: number = 0; i < amplitudes.length; i++) {
            const amplitude: number = amplitudes[i];
            const radius: number = (content.baseRadius + amplitude * content.multiplier) * this._scale;
            const xLeft: number = this._centerX + radius * Math.cos(currAngle);
            const xRight: number = this._centerX - radius * Math.cos(currAngle);
            const y: number = this._centerY + radius * Math.sin(currAngle);
            currAngle += sampleAngle;

            const gradientColor: RGB = getGradientColor(content.startColor, content.endColor, amplitude / 255);
            this._drawCircle(canvasContext, xLeft, y, gradientColor, content.sampleRadius * this._scale);
            this._drawCircle(canvasContext, xRight, y, gradientColor, content.sampleRadius * this._scale);
        }
    }

    private _drawCircle(
        canvasContext: CanvasRenderingContext2D,
        centerX: number,
        centerY: number,
        fillColor: RGB,
        sampleRadius: number
    ): void {
        canvasContext.fillStyle = `rgb(${fillColor.r}, ${fillColor.g}, ${fillColor.b})`;
        canvasContext.beginPath();
        canvasContext.arc(centerX, centerY, sampleRadius, 0, 2 * Math.PI);
        canvasContext.fill();
        canvasContext.stroke();
    }
}
