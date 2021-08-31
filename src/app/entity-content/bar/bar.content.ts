import { IEntityConfig } from '../../entity/entity.types';
import { BaseContent } from '../base/base.content';
import { RGB } from 'ngx-color';
import { getGradientColor } from '../../shared/utils';
import { IBarContentConfig } from './bar.content.types';

export class BarContent extends BaseContent<IBarContentConfig> {

    protected _animateContent(entity: IEntityConfig<IBarContentConfig>): void {
        const config: IBarContentConfig = entity.entityContentConfig;

        this._canvasContext.globalAlpha = entity.currentOpacity;
        const strokeColor: string = `rgb(${config.startColor.r}, ${config.startColor.g}, ${config.startColor.b})`;
        this._canvasContext.shadowBlur = config.shadowBlur
        this._canvasContext.shadowColor = strokeColor;
        this._canvasContext.strokeStyle = strokeColor;

        let currPos = this._scaledLeft;
        config.amplitudes.forEach(amplitude => {
            const gradientColor: RGB = getGradientColor(config.startColor, config.endColor, (amplitude / 255));
            amplitude *= config.multiplier * this._scale;

            // Bar
            this._drawBar(
                currPos,
                this._scaledTop + this._scaledHeight - amplitude,
                amplitude,
                Math.ceil(config.barSize * this._scale),
                gradientColor
            );

            // Bar Cap
            this._drawBar(
                currPos,
                this._scaledTop + this._scaledHeight - amplitude - config.barCapSize * this._scale,
                config.barCapSize * this._scale,
                Math.ceil(config.barSize * this._scale),
                config.startColor
            );

            currPos += (config.barSize * this._scale) + (config.barSpacing * this._scale);
        });
    }

    private _drawBar(startX: number, startY: number, height: number, width: number, fillColor: RGB): void {
        this._canvasContext.fillStyle = `rgb(${fillColor.r}, ${fillColor.g}, ${fillColor.b})`;
        this._canvasContext.fillRect(startX, startY, width, height);
        this._canvasContext.strokeRect(startX, startY, width, height);
    }

}
