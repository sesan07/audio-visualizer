import { IBarcleVisualizerConfig } from '../visualizer-entity.types';
import { IEntityConfig } from '../../entity.types';
import { getRadians } from '../../../shared/utils';
import { BaseVisualizer } from './base.visualizer';
import { getGradientColor } from '../visualizer-entity.utils';
import { Color, RGB } from 'ngx-color';

export class BarcleVisualizer extends BaseVisualizer<IBarcleVisualizerConfig> {

    public _animate(entity: IEntityConfig<IBarcleVisualizerConfig>): void {
        const config: IBarcleVisualizerConfig = entity.entityContentConfig;

        this._setMovement(entity)
        this._setRotation(entity)
        const scale: number = this._getScale(entity)

        const centerX: number = entity.width / 2 + entity.left;
        const centerY: number = entity.height / 2 + entity.top;
        const rotationRadians: number = getRadians(entity.rotation)
        const sampleAngle: number = (getRadians(360) / config.sampleCount) / 2;

        let currAngle: number = getRadians(90) + sampleAngle / 2;
        for (let i = 0; i < config.amplitudes.length; i++) {
            const amplitude: number = config.amplitudes[i];
            if (amplitude === 0) {
                currAngle += sampleAngle;
                continue;
            }

            const radius: number = (config.baseRadius + amplitude) * config.multiplier * scale;
            const startAngle = (currAngle - sampleAngle / 2) + rotationRadians;
            const endAngle = (currAngle + sampleAngle / 2) + rotationRadians;
            const startAngle2 = (Math.PI - currAngle - sampleAngle / 2) + rotationRadians;
            const endAngle2 = (Math.PI - currAngle + sampleAngle / 2) + rotationRadians;
            currAngle += sampleAngle;

            // const gradientColor: Color = _getGradientColor(this._startColor, this._endColor, (i / this._amplitudes.length));
            const gradientColor: RGB = getGradientColor(config.startColor, config.endColor, (amplitude / 255));

            this._drawBar(centerX, centerY, startAngle, endAngle, radius, config.baseRadius, scale, gradientColor, config.opacity);
            this._drawBar(centerX, centerY, startAngle2, endAngle2, radius, config.baseRadius, scale, gradientColor, config.opacity);
        }
        this._drawCap(centerX, centerY, config.baseRadius, scale, config.startColor, config.opacity);
    }

    private _drawBar(centerX: number, centerY: number, startAngle: number, endAngle: number, height: number, baseRadius: number, scale: number, color: RGB, opacity: number): void {
        // this._canvasContext.strokeStyle = '#00000055';
        // this._canvasContext.globalAlpha = opacity;
        // this._canvasContext.shadowBlur = shadowBlur
        // this._canvasContext.shadowColor = shadowColorHex;
        this._canvasContext.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;

        this._canvasContext.beginPath();
        this._canvasContext.arc(centerX, centerY, baseRadius * scale, startAngle, endAngle);
        this._canvasContext.arc(centerX, centerY, height, endAngle, startAngle, true);
        this._canvasContext.closePath();
        // this._canvasContext.stroke();
        this._canvasContext.fill();
    }

    private _drawCap(centerX: number, centerY: number, baseRadius: number, scale: number, color: RGB, opacity: number): void {

        this._canvasContext.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity})`;
        this._canvasContext.beginPath();
        this._canvasContext.arc(centerX, centerY, baseRadius * scale, 0, 2 * Math.PI);
        // this._canvasContext.stroke();
        this._canvasContext.fill();
    }

}
