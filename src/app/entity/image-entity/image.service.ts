import { Injectable } from '@angular/core';
import { IEntityContentService } from '../entity.types';
import { IImageConfig } from './image-entity.types';
import { SourceService } from '../../shared/source-service/source.service';
import { ISource } from '../../shared/source-service/source.service.types';

@Injectable({
    providedIn: 'root'
})
export class ImageService extends SourceService implements IEntityContentService {
    defaultSource: ISource = { name: 'Mako', src: 'assets/image/mako.png' };

    sources: ISource[] = [
        this.defaultSource,
        { name: 'Rain Drop', src: 'assets/image/rain-drop.png' }
    ];

    beforeEmit(config: IImageConfig): void {
    }

    getDefaultContent(): IImageConfig {
        return {
            src: this.sources[0].src,
            scale: 1,
            opacity: 1
        };
    }

    getCleanPreset(config: IImageConfig): IImageConfig {
        const imageClone = Object.assign({}, config);
        imageClone.src = this.defaultSource.src;
        return imageClone;
    }

    updatePreset(config: IImageConfig): void {

    }
}
