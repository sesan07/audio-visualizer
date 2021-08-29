import { BaseContent } from '../base/base.content';
import { IEntityConfig } from '../../entity/entity.types';
import { IImageContentConfig } from './image.content.types';

export class ImageContent extends BaseContent<IImageContentConfig> {

    protected _animateContent(entity: IEntityConfig<IImageContentConfig>): void {
        const config: IImageContentConfig = entity.entityContentConfig;

        this._canvasContext.shadowBlur = 0;
        this._canvasContext.drawImage(config.element, this._scaledLeft, this._scaledTop, this._scaledWidth, this._scaledHeight)
    }

}