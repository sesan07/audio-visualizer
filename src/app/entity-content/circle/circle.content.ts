import { IEntityConfig } from '../../entity/entity.types';
import { getGradientColor, getRadians } from '../../shared/utils';
import { BaseContent } from '../base/base.content';
import { RGB } from 'ngx-color';
import { ICircleContentConfig } from './circle.content.types';

export class CircleContent extends BaseContent<ICircleContentConfig> {

    protected _animateContent(entity: IEntityConfig<ICircleContentConfig>): void {
        const config: ICircleContentConfig = entity.entityContentConfig;

        const sampleAngle: number = (getRadians(360) / config.sampleCount) / 2;
        let currAngle: number = getRadians(90) + sampleAngle / 2;
        // Reverse to turn visualization upside down
        for (let i = 0; i < config.amplitudes.length; i++) {
            const amplitude: number = config.amplitudes[i];
            const radius: number = (config.baseRadius + amplitude * config.multiplier) * this._scale;
            const xLeft: number = this._centerX + radius * Math.cos(currAngle);
            const xRight: number = this._centerX - radius * Math.cos(currAngle);
            const y: number = this._centerY + radius * Math.sin(currAngle);
            currAngle += sampleAngle;

            const gradientColor: RGB = getGradientColor(config.startColor, config.endColor, (amplitude / 255));
            this._drawCircle(xLeft, y, gradientColor, config.startColor, config.sampleRadius * this._scale, entity.opacity, config.shadowBlur);
            this._drawCircle(xRight, y, gradientColor, config.startColor, config.sampleRadius * this._scale, entity.opacity, config.shadowBlur);
        }
    }

    private _drawCircle(centerX: number, centerY: number, fillColor: RGB, strokeColor: RGB, sampleRadius: number, opacity: number, shadowBlur: number): void {
        this._canvasContext.shadowBlur = shadowBlur
        this._canvasContext.shadowColor = `rgba(${strokeColor.r}, ${strokeColor.g}, ${strokeColor.b}, ${opacity})`;
        this._canvasContext.fillStyle = `rgba(${fillColor.r}, ${fillColor.g}, ${fillColor.b}, ${opacity})`;
        this._canvasContext.strokeStyle = `rgba(${strokeColor.r}, ${strokeColor.g}, ${strokeColor.b}, ${opacity})`;
        this._canvasContext.beginPath();
        this._canvasContext.arc(centerX, centerY, sampleRadius, 0, 2 * Math.PI);
        this._canvasContext.fill();
        this._canvasContext.stroke();
    }
}
