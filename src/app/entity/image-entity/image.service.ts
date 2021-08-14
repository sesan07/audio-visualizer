import { Injectable } from '@angular/core';
import { IEntityContentService } from '../entity.types';
import { IImageConfig } from './image-entity.types';
import { SourceService } from '../../shared/source-service/source.service';
import { ISource } from '../../shared/source-service/source.service.types';

@Injectable({
    providedIn: 'root'
})
export class ImageService extends SourceService implements IEntityContentService {

    sources: ISource[] = [
        { name: 'Mako', src: 'assets/image/mako.png' },
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
}
