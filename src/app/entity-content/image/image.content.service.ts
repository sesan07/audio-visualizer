import { Injectable } from '@angular/core';
import { BaseContentService } from '../base/base.content.service';
import { Entity } from '../../entity/entity.types';
import { ImageContent } from './image.content.types';
import { ImageSourceService } from '../../shared/source-services/image.source.service';

@Injectable({
    providedIn: 'root'
})
export class ImageContentService extends BaseContentService<ImageContent> {

    constructor(private _imageService: ImageSourceService) {
        super();
    }

    getCleanPreset(content: ImageContent): ImageContent {
        return { source: undefined, element: undefined };
    }

    getDefaultContent(isEmitted: boolean): ImageContent {
        return {
            source: this._imageService.sources[0],
            element: this._imageService.getSourceElement(this._imageService.sources[0])
        };
    }

    setEntityDimensions(entity: Entity<ImageContent>): void {
        entity.height = 250;

        const content: ImageContent = entity.entityContent;
        const heightRatio: number = entity.height / content.element.height;
        entity.width = content.element.width * heightRatio;
    }

    updatePreset(content: ImageContent): ImageContent {
        return this.getDefaultContent(false);
    }
}
