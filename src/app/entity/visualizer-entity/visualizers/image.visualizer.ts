import { BaseVisualizer } from './base.visualizer';
import { IImageConfig } from '../../image-entity/image-entity.types';
import { IEntityConfig } from '../../entity.types';
import { getRadians } from '../../../shared/utils';

export class ImageVisualizer extends BaseVisualizer<IImageConfig> {

    _animate(entity: IEntityConfig<IImageConfig>): void {
        const config: IImageConfig = entity.entityContentConfig;

        this._setMovement(entity)
        this._setRotation(entity)
        const scale: number = this._getScale(entity)


        const scaledWidth: number = entity.width * scale
        const scaledHeight: number = entity.height * scale
        const scaledLeft: number = entity.left - (scaledWidth - entity.width) / 2;
        const scaledTop: number = entity.top - (scaledHeight - entity.height) / 2;
        const originX = (scaledLeft) + (scaledWidth / 2);
        const originY = (scaledTop) + (scaledHeight / 2);


        // const centerX: number = entity.width / 2 + entity.left;
        // const centerY: number = entity.height / 2 + entity.top;
        // const rotationRadians: number = getRadians(entity.rotation)

        this._canvasContext.translate(originX, originY)
        this._canvasContext.rotate(entity.rotation * Math.PI / 180)
        this._canvasContext.translate(-originX, -originY)



        this._canvasContext.drawImage(config.element, scaledLeft, scaledTop, scaledWidth, scaledHeight)
        // console.log(config)

    }

}