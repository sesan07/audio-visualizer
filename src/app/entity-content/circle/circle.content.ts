import { IEntityConfig } from '../../entity/entity.types';
import { getGradientColor, getRadians } from '../../shared/utils';
import { BaseContent } from '../base/base.content';
import { RGB } from 'ngx-color';
import { ICircleContentConfig } from './circle.content.types';

export class CircleContent extends BaseContent<ICircleContentConfig> {

    protected _animateContent(entity: IEntityConfig<ICircleContentConfig>): void {
        const config: ICircleContentConfig = entity.entityContentConfig;

        this._canvasContext.globalAlpha = entity.currentOpacity;
        const strokeColor: string = `rgb(${config.startColor.r}, ${config.startColor.g}, ${config.startColor.b})`;
        this._canvasContext.shadowBlur = config.shadowBlur
        this._canvasContext.shadowColor = strokeColor;
        this._canvasContext.strokeStyle = strokeColor;

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
            this._drawCircle(xLeft, y, gradientColor, config.sampleRadius * this._scale);
            this._drawCircle(xRight, y, gradientColor, config.sampleRadius * this._scale);
        }
    }

    private _drawCircle(centerX: number, centerY: number, fillColor: RGB, sampleRadius: number): void {
        this._canvasContext.fillStyle = `rgb(${fillColor.r}, ${fillColor.g}, ${fillColor.b})`;
        this._canvasContext.beginPath();
        this._canvasContext.arc(centerX, centerY, sampleRadius, 0, 2 * Math.PI);
        this._canvasContext.fill();
        this._canvasContext.stroke();
    }
}
