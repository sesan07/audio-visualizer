import { Injectable } from '@angular/core';

import { Entity } from 'src/app/entity-service/entity.types';
import { AudioSourceService } from 'src/app/source-services/audio.source.service';
import { ImageSourceService } from 'src/app/source-services/image.source.service';
import { BaseContentService } from '../base/base.content.service';
import { ImageContentAnimator } from './image.content.animator';
import { ImageContent } from './image.content.types';

@Injectable({
    providedIn: 'root',
})
export class ImageContentService extends BaseContentService<ImageContent> {
    protected _animator: ImageContentAnimator;

    constructor(audioService: AudioSourceService, private _imageService: ImageSourceService) {
        super();
        this._animator = new ImageContentAnimator(audioService.amplitudesMap, audioService.oomph);
    }

    getDefaultContent(isEmitted: boolean): ImageContent {
        return {
            source: this._imageService.sources[0],
            currGifIndex: 0,
            speed: 1,
        };
    }

    setEntityDimensions({ content, transform }: Entity<ImageContent>): void {
        transform.height = 500 * transform.scale;

        const firstFrame: HTMLCanvasElement = content.source.frames![0];
        const heightRatio: number = transform.height / firstFrame.height;
        transform.width = firstFrame.width * heightRatio;
    }

    protected _getAddPreset(content: ImageContent): ImageContent {
        return { source: undefined!, currGifIndex: undefined!, speed: undefined! };
    }

    protected _getLoadPreset(content: ImageContent): ImageContent {
        return this.getDefaultContent(false);
    }
}
