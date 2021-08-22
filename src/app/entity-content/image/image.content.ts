import { BaseContent } from '../base/base.content';
import { IEntityConfig } from '../../entity/entity.types';
import { getRadians } from '../../shared/utils';
import { IImageContentConfig } from './image.content.types';

export class ImageContent extends BaseContent<IImageContentConfig> {

    _animate(entity: IEntityConfig<IImageContentConfig>): void {
        const config: IImageContentConfig = entity.entityContentConfig;

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

        this._canvasContext.drawImage(config.element, scaledLeft, scaledTop, scaledWidth, scaledHeight)
    }

}