import { IEntityConfig } from '../../entity/entity.types';
import { getGradientColor, getRadians } from '../../shared/utils';
import { BaseContent } from '../base/base.content';
import { RGB } from 'ngx-color';
import { IBarcleContentConfig } from './barcle.content.types';

export class BarcleContent extends BaseContent<IBarcleContentConfig> {

    protected _animateContent(entity: IEntityConfig<IBarcleContentConfig>): void {
        const config: IBarcleContentConfig = entity.entityContentConfig;

        const strokeColor: string = `rgba(${config.startColor.r}, ${config.startColor.g}, ${config.startColor.b}, ${entity.opacity})`;
        this._canvasContext.shadowBlur = config.shadowBlur
        this._canvasContext.shadowColor = strokeColor;
        this._canvasContext.strokeStyle = strokeColor;

        const sampleAngle: number = (getRadians(360) / config.sampleCount) / 2;
        let currAngle: number = getRadians(90) + sampleAngle / 2;
        // Reverse to turn visualization upside down
        for (let i = 0; i < config.amplitudes.length; i++) {
            const amplitude: number = config.amplitudes[i];
            const radius: number = (config.baseRadius + config.ringSize + amplitude * config.multiplier) * this._scale;
            const startAngle = currAngle - sampleAngle / 2;
            const endAngle = currAngle + sampleAngle / 2;
            const startAngle2 = Math.PI - currAngle - sampleAngle / 2;
            const endAngle2 = Math.PI - currAngle + sampleAngle / 2;

            const gradientColor: RGB = getGradientColor(config.startColor, config.endColor, (amplitude / 255));
            this._drawBar(startAngle, endAngle, radius, config.baseRadius * this._scale, gradientColor, entity.opacity);
            this._drawBar(startAngle2, endAngle2, radius, config.baseRadius * this._scale, gradientColor, entity.opacity);

            currAngle += sampleAngle;
        }
        if (config.fillCenter) {
            this._drawCap(config.startColor, config.baseRadius * this._scale, entity.opacity);
        }
    }

    private _drawBar(startAngle: number, endAngle: number, height: number, baseRadius: number, fillColor: RGB, opacity: number): void {
        this._canvasContext.fillStyle = `rgba(${fillColor.r}, ${fillColor.g}, ${fillColor.b}, ${opacity})`;
        this._canvasContext.beginPath();
        this._canvasContext.arc(this._centerX, this._centerY, baseRadius, startAngle, endAngle);
        this._canvasContext.arc(this._centerX, this._centerY, height, endAngle, startAngle, true);
        this._canvasContext.closePath();
        this._canvasContext.fill();
        this._canvasContext.stroke();
    }

    private _drawCap(fillColor: RGB, baseRadius: number, opacity: number): void {
        this._canvasContext.fillStyle = `rgba(${fillColor.r}, ${fillColor.g}, ${fillColor.b}, ${opacity})`;
        this._canvasContext.beginPath();
        this._canvasContext.arc(this._centerX, this._centerY, baseRadius, 0, 2 * Math.PI);
        this._canvasContext.fill();
    }

}
