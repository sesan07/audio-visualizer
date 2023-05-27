import { Entity } from '../../app.types';
import { getGradientColor, getRadians } from '../../shared/utils';
import { BaseContentAnimator } from '../base/base.content-animator';
import { RGB } from 'ngx-color';
import { BarcleContent } from './barcle.content.types';

export class BarcleContentAnimator extends BaseContentAnimator<BarcleContent> {
    protected _animateContent(
        { content, opacity }: Entity<BarcleContent>,
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
        // Reverse to turn visualizer upside down
        for (let i: number = 0; i < amplitudes.length; i++) {
            const amplitude: number = amplitudes[i];
            const radius: number =
                (content.baseRadius + content.ringSize + amplitude * content.multiplier) * this._scale;
            const startAngle: number = currAngle - sampleAngle / 2;
            const endAngle: number = currAngle + sampleAngle / 2;
            const startAngle2: number = Math.PI - currAngle - sampleAngle / 2;
            const endAngle2: number = Math.PI - currAngle + sampleAngle / 2;

            const gradientColor: RGB = getGradientColor(content.startColor, content.endColor, amplitude / 255);
            this._drawBar(canvasContext, startAngle, endAngle, radius, content.baseRadius * this._scale, gradientColor);
            this._drawBar(
                canvasContext,
                startAngle2,
                endAngle2,
                radius,
                content.baseRadius * this._scale,
                gradientColor
            );

            currAngle += sampleAngle;
        }
        if (content.fillCenter) {
            this._drawCap(canvasContext, content.startColor, content.baseRadius * this._scale);
        }
    }

    private _drawBar(
        canvasContext: CanvasRenderingContext2D,
        startAngle: number,
        endAngle: number,
        height: number,
        baseRadius: number,
        fillColor: RGB
    ): void {
        canvasContext.fillStyle = `rgb(${fillColor.r}, ${fillColor.g}, ${fillColor.b})`;
        canvasContext.beginPath();
        canvasContext.arc(this._centerX, this._centerY, baseRadius, startAngle, endAngle);
        canvasContext.arc(this._centerX, this._centerY, height, endAngle, startAngle, true);
        canvasContext.closePath();
        canvasContext.fill();
        canvasContext.stroke();
    }

    private _drawCap(canvasContext: CanvasRenderingContext2D, fillColor: RGB, baseRadius: number): void {
        canvasContext.fillStyle = `rgb(${fillColor.r}, ${fillColor.g}, ${fillColor.b})`;
        canvasContext.beginPath();
        canvasContext.arc(this._centerX, this._centerY, baseRadius, 0, 2 * Math.PI);
        canvasContext.fill();
    }
}
