import { IEntityConfig } from '../../entity/entity.types';
import { BaseContent } from '../base/base.content';
import { RGB } from 'ngx-color';
import { getGradientColor } from '../../shared/utils';
import { IBarContentConfig } from './bar.content.types';

export class BarContent extends BaseContent<IBarContentConfig> {

    protected _animateContent(entity: IEntityConfig<IBarContentConfig>): void {
        const config: IBarContentConfig = entity.entityContentConfig;

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
                gradientColor,
                config.startColor,
                entity.opacity
            );

            // Bar Cap
            this._drawBar(
                currPos,
                this._scaledTop + this._scaledHeight - amplitude - config.barCapSize * this._scale,
                config.barCapSize * this._scale,
                Math.ceil(config.barSize * this._scale),
                config.startColor,
                config.startColor,
                entity.opacity
            );

            currPos += (config.barSize * this._scale) + (config.barSpacing * this._scale);
        });
    }

    private _drawBar(startX: number, startY: number, height: number, width: number, fillColor: RGB, strokeColor: RGB, opacity: number): void {
        // this._canvasContext.shadowBlur = shadowBlur
        // this._canvasContext.shadowColor = shadowColorHex;
        this._canvasContext.fillStyle = `rgba(${fillColor.r}, ${fillColor.g}, ${fillColor.b}, ${opacity})`;
        this._canvasContext.strokeStyle = `rgba(${strokeColor.r}, ${strokeColor.g}, ${strokeColor.b}, ${opacity})`
        this._canvasContext.fillRect(startX, startY, width, height);
        this._canvasContext.strokeRect(startX, startY, width, height);
    }

}
