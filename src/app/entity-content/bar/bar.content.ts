import { IEntityConfig } from '../../entity/entity.types';
import { BaseContent } from '../base/base.content';
import { RGB } from 'ngx-color';
import { getGradientColor, getRadians } from '../../shared/utils';
import { IBarContentConfig } from './bar.content.types';

export class BarContent extends BaseContent<IBarContentConfig> {

    public _animate(entity: IEntityConfig<IBarContentConfig>): void {
        const config: IBarContentConfig = entity.entityContentConfig;

        this._setMovement(entity)
        this._setRotation(entity)

        const scale: number = this._getScale(entity)
        const scaledWidth: number = entity.width * scale
        const scaledHeight: number = entity.height * scale
        const scaledLeft: number = entity.left - (scaledWidth - entity.width) / 2;
        const scaledTop: number = entity.top - (scaledHeight - entity.height) / 2;
        const originX = (scaledLeft) + (scaledWidth / 2);
        const originY = (scaledTop) + (scaledHeight / 2);

        this._canvasContext.translate(originX, originY)
        this._canvasContext.rotate(getRadians(entity.rotation))
        this._canvasContext.translate(-originX, -originY)

        let currPos = scaledLeft;
        config.amplitudes.forEach((amplitude, i) => {
            const gradientColor: RGB = getGradientColor(config.startColor, config.endColor, (amplitude / 255));
            amplitude *= config.multiplier * scale;

            // Bar
            this._drawBar(
                currPos,
                scaledTop + scaledHeight - amplitude,
                amplitude,
                Math.ceil(config.barSize * scale),
                gradientColor,
                config.startColor,
                entity.opacity
            );

            // Bar Cap
            this._drawBar(
                currPos,
                scaledTop + scaledHeight - amplitude - config.barCapSize * scale,
                config.barCapSize * scale,
                Math.ceil(config.barSize * scale),
                config.startColor,
                config.startColor,
                entity.opacity
            );

            currPos += (config.barSize * scale) + (config.barSpacing * scale);
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
