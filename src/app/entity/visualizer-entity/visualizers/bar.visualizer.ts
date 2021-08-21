import { IBarVisualizerConfig } from '../visualizer-entity.types';
import { IEntityConfig } from '../../entity.types';
import { BaseVisualizer } from './base.visualizer';
import { getGradientColor } from '../visualizer-entity.utils';
import { RGB } from 'ngx-color';

export class BarVisualizer extends BaseVisualizer<IBarVisualizerConfig> {

    public _animate(entity: IEntityConfig<IBarVisualizerConfig>): void {
        const config: IBarVisualizerConfig = entity.entityContentConfig;

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
        this._canvasContext.rotate(entity.rotation * Math.PI / 180)
        this._canvasContext.translate(-originX, -originY)

        let currPos = scaledLeft;
        config.amplitudes.forEach((amplitude, i) => {
            // const gradientColor: Color = _getGradientColor(config.startColorHex, config.endColorHex, (i / this._amplitudes.length));
            const gradientColor: RGB = getGradientColor(config.startColor, config.endColor, (amplitude / 255));


            amplitude *= config.multiplier * scale;
            // Bar
            this._drawBar(
                currPos,
                scaledTop + scaledHeight - amplitude,
                Math.ceil(config.barSize * scale),
                amplitude,
                entity.rotation,
                gradientColor,
                config.opacity
            );

            // Bar Cap
            this._drawBar(
                currPos,
                scaledTop + scaledHeight - amplitude - config.barCapSize * scale,
                Math.ceil(config.barSize * scale),
                config.barCapSize * scale,
                entity.rotation,
                config.startColor,
                config.opacity
            );

            currPos += (config.barSize * scale) + (config.barSpacing * scale);
        });
    }

    private _drawBar(startX: number, startY: number, width: number, height: number, rotation: number, color: RGB, opacity: number): void {
        // this._canvasContext.shadowBlur = shadowBlur
        // this._canvasContext.shadowColor = shadowColorHex;
        this._canvasContext.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
        this._canvasContext.fillRect(startX, startY, width, height);
    }

}
