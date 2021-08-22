import { IEntityConfig } from '../../entity/entity.types';
import { getGradientColor, getRadians } from '../../shared/utils';
import { BaseContent } from '../base/base.content';
import { RGB } from 'ngx-color';
import { IBarcleContentConfig } from './barcle.content.types';

export class BarcleContent extends BaseContent<IBarcleContentConfig> {

    public _animate(entity: IEntityConfig<IBarcleContentConfig>): void {
        const config: IBarcleContentConfig = entity.entityContentConfig;

        this._setMovement(entity)
        this._setRotation(entity)

        const scale: number = this._getScale(entity)
        const centerX: number = entity.width / 2 + entity.left;
        const centerY: number = entity.height / 2 + entity.top;
        const rotationRadians: number = getRadians(entity.rotation)
        const sampleAngle: number = (getRadians(360) / config.sampleCount) / 2;

        let currAngle: number = getRadians(90) + sampleAngle / 2;
        // Reverse to turn visualization upside down
        for (let i = 0; i < config.amplitudes.length; i++) {
            const amplitude: number = config.amplitudes[i];
            const radius: number = (amplitude * config.multiplier + config.baseRadius + config.ringSize) * scale;
            const startAngle: number = (currAngle - sampleAngle / 2) + rotationRadians;
            const endAngle: number = (currAngle + sampleAngle / 2) + rotationRadians;
            const startAngle2: number = (Math.PI - currAngle - sampleAngle / 2) + rotationRadians;
            const endAngle2: number = (Math.PI - currAngle + sampleAngle / 2) + rotationRadians;

            const gradientColor: RGB = getGradientColor(config.startColor, config.endColor, (amplitude / 255));
            this._drawBar(
                centerX,
                centerY,
                startAngle,
                endAngle,
                radius,
                config.baseRadius * scale,
                gradientColor,
                config.startColor,
                entity.opacity
            );
            this._drawBar(
                centerX,
                centerY,
                startAngle2,
                endAngle2,
                radius,
                config.baseRadius * scale,
                gradientColor,
                config.startColor,
                entity.opacity
            );

            currAngle += sampleAngle;
        }
        if (config.fillCenter) {
            this._drawCap(centerX, centerY, config.startColor, config.baseRadius * scale, entity.opacity);
        }
    }

    private _drawBar(centerX: number, centerY: number, startAngle: number, endAngle: number, height: number, baseRadius: number, fillColor: RGB, strokeColor: RGB, opacity: number): void {
        // this._canvasContext.shadowBlur = shadowBlur
        // this._canvasContext.shadowColor = shadowColorHex;
        this._canvasContext.fillStyle = `rgba(${fillColor.r}, ${fillColor.g}, ${fillColor.b}, ${opacity})`;
        this._canvasContext.strokeStyle = `rgba(${strokeColor.r}, ${strokeColor.g}, ${strokeColor.b}, ${opacity})`;
        this._canvasContext.beginPath();
        this._canvasContext.arc(centerX, centerY, baseRadius, startAngle, endAngle);
        this._canvasContext.arc(centerX, centerY, height, endAngle, startAngle, true);
        this._canvasContext.closePath();
        this._canvasContext.fill();
        this._canvasContext.stroke();
    }

    private _drawCap(centerX: number, centerY: number, fillColor: RGB, baseRadius: number, opacity: number): void {
        this._canvasContext.fillStyle = `rgba(${fillColor.r}, ${fillColor.g}, ${fillColor.b}, ${opacity})`;
        this._canvasContext.beginPath();
        this._canvasContext.arc(centerX, centerY, baseRadius, 0, 2 * Math.PI);
        this._canvasContext.fill();
    }

}
