import { Injectable } from '@angular/core';
import { BaseContentService } from '../base/base.content.service';
import { IEntityConfig } from '../../entity/entity.types';
import { IImageContentConfig } from './image.content.types';
import { ImageSourceService } from '../../shared/source-services/image.source.service';

@Injectable({
    providedIn: 'root'
})
export class ImageContentService extends BaseContentService<IImageContentConfig> {

    constructor(private _imageService: ImageSourceService) {
        super();
    }

    getCleanPreset(config: IImageContentConfig): IImageContentConfig {
        return Object.assign({}, config);
    }

    getDefaultContent(isEmitted: boolean): IImageContentConfig {
        return {
            name: this._imageService.sources[0].name,
            element: this._imageService.getSourceElement(this._imageService.sources[0])
        };
    }

    setEntityDimensions(entity: IEntityConfig<IImageContentConfig>): void {
        entity.height = 200;

        const config: IImageContentConfig = entity.entityContentConfig;
        const heightRatio: number = entity.height / config.element.height;
        entity.width = config.element.width * heightRatio;
    }

    updatePreset(config: IImageContentConfig): IImageContentConfig {
        return Object.assign({}, config);
    }
}
