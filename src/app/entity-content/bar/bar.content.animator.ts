import { RGB } from 'ngx-color';

import { Entity } from 'src/app/entity-service/entity.types';
import { getGradientColor } from 'src/app/utils';
import { BaseContentAnimator } from '../base/base.content.animator';
import { BarContent } from './bar.content.types';

export class BarContentAnimator extends BaseContentAnimator<BarContent> {
    protected _animateContent({ content, opacity }: Entity<BarContent>, canvasContext: CanvasRenderingContext2D): void {
        canvasContext.lineWidth = 1;
        canvasContext.globalAlpha = opacity.current;
        const strokeColor: string = `rgb(${content.startColor.r}, ${content.startColor.g}, ${content.startColor.b})`;
        canvasContext.shadowBlur = content.shadowBlur;
        canvasContext.shadowColor = strokeColor;
        canvasContext.strokeStyle = strokeColor;

        const amplitudes: Uint8Array = this._amplitudesMap[content.sampleCount];
        let currPos: number = this._scaledLeft;
        if (content.isReversed) {
            for (let i: number = amplitudes.length - 1; i >= 0; i--) {
                const amplitude: number = amplitudes[i];
                this._draw(content, canvasContext, amplitude, currPos);
                currPos += content.barSize * this._scale + content.barSpacing * this._scale;
            }
        } else {
            for (let i: number = 0; i < amplitudes.length; i++) {
                const amplitude: number = amplitudes[i];
                this._draw(content, canvasContext, amplitude, currPos);
                currPos += content.barSize * this._scale + content.barSpacing * this._scale;
            }
        }
    }

    private _draw(
        content: BarContent,
        canvasContext: CanvasRenderingContext2D,
        amplitude: number,
        currPos: number
    ): void {
        const gradientColor: RGB = getGradientColor(content.startColor, content.endColor, amplitude / 255);
        amplitude *= content.multiplier * this._scale;

        // Bar
        this._drawBar(
            canvasContext,
            currPos,
            this._scaledTop + this._scaledHeight - amplitude,
            amplitude,
            Math.ceil(content.barSize * this._scale),
            gradientColor
        );

        // Bar Cap
        this._drawBar(
            canvasContext,
            currPos,
            this._scaledTop + this._scaledHeight - amplitude - content.barCapSize * this._scale,
            content.barCapSize * this._scale,
            Math.ceil(content.barSize * this._scale),
            content.startColor
        );
    }

    private _drawBar(
        canvasContext: CanvasRenderingContext2D,
        startX: number,
        startY: number,
        height: number,
        width: number,
        fillColor: RGB
    ): void {
        canvasContext.fillStyle = `rgb(${fillColor.r}, ${fillColor.g}, ${fillColor.b})`;
        canvasContext.fillRect(startX, startY, width, height);
        canvasContext.strokeRect(startX, startY, width, height);
    }
}
