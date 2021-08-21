import { ICircleVisualizerConfig } from '../visualizer-entity.types';
import { IEntityConfig } from '../../entity.types';
import { getRadians } from '../../../shared/utils';
import { BaseVisualizer } from './base.visualizer';
import { getGradientColor } from '../visualizer-entity.utils';
import { RGB } from 'ngx-color';

export class CircleVisualizer extends BaseVisualizer<ICircleVisualizerConfig> {

    public _animate(entity: IEntityConfig<ICircleVisualizerConfig>): void {
        const config: ICircleVisualizerConfig = entity.entityContentConfig;

        this._setMovement(entity)
        this._setRotation(entity)
        const scale: number = this._getScale(entity)

        const centerX: number = entity.left + entity.width / 2;
        const centerY: number = entity.top + entity.height / 2;
        const sampleAngle: number = (getRadians(360) / config.sampleCount) / 2;
        const startAngle: number = getRadians(90) + getRadians(entity.rotation);

        let currAngleLeft: number = startAngle + sampleAngle / 2;
        let currAngleRight: number = startAngle - sampleAngle / 2;

        // Reverse to turn visualization upside down
        for (let i = 0; i < config.amplitudes.length; i++) {
            const amplitude: number = config.amplitudes[i];

            const radius: number = (config.baseRadius + amplitude) * config.multiplier * scale;
            const xLeft = centerX + radius * Math.cos(currAngleLeft);
            const yLeft = centerY + radius * Math.sin(currAngleLeft);

            const xRight = centerX + radius * Math.cos(currAngleRight);
            const yRight = centerY + radius * Math.sin(currAngleRight);

            currAngleLeft += sampleAngle;
            currAngleRight -= sampleAngle;

            // const gradientColor: Color = _getGradientColor(this._startColor, this._endColor, (i / this._amplitudes.length));
            const gradientColor: RGB = getGradientColor(config.startColor, config.endColor, (amplitude / 255));

            this._drawPoint(xLeft, yLeft, config.sampleRadius, scale, gradientColor, config.opacity);
            this._drawPoint(xRight, yRight, config.sampleRadius, scale, gradientColor, config.opacity);
        }
    }

    private _drawPoint(centerX: number, centerY: number, sampleRadius: number, scale: number, color: RGB, opacity: number): void {
        // this._canvasContext.globalAlpha = opacity;
        // this._canvasContext.shadowBlur = shadowBlur
        // this._canvasContext.shadowColor = shadowColorHex;
        this._canvasContext.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
        this._canvasContext.beginPath();
        this._canvasContext.arc(centerX, centerY, sampleRadius * scale, 0, 2 * Math.PI);
        this._canvasContext.fill();
    }
}
