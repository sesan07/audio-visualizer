import { IEntityConfig } from '../../entity/entity.types';
import { getGradientColor, getRadians } from '../../shared/utils';
import { BaseContent } from '../base/base.content';
import { RGB } from 'ngx-color';
import { ICircleContentConfig } from './circle.content.types';

export class CircleContent extends BaseContent<ICircleContentConfig> {

    public _animate(entity: IEntityConfig<ICircleContentConfig>): void {
        const config: ICircleContentConfig = entity.entityContentConfig;

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

            const gradientColor: RGB = getGradientColor(config.startColor, config.endColor, (amplitude / 255));
            this._drawPoint(xLeft, yLeft, gradientColor, config.startColor, config.sampleRadius * scale, entity.opacity);
            this._drawPoint(xRight, yRight, gradientColor, config.startColor, config.sampleRadius * scale, entity.opacity);
        }
    }

    private _drawPoint(centerX: number, centerY: number, fillColor: RGB, strokeColor: RGB, sampleRadius: number, opacity: number): void {
        // this._canvasContext.shadowBlur = shadowBlur
        // this._canvasContext.shadowColor = shadowColorHex;
        this._canvasContext.fillStyle = `rgba(${fillColor.r}, ${fillColor.g}, ${fillColor.b}, ${opacity})`;
        this._canvasContext.strokeStyle = `rgba(${strokeColor.r}, ${strokeColor.g}, ${strokeColor.b}, ${opacity})`;
        this._canvasContext.beginPath();
        this._canvasContext.arc(centerX, centerY, sampleRadius, 0, 2 * Math.PI);
        this._canvasContext.fill();
        this._canvasContext.stroke();
    }
}
