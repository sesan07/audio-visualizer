import { Injectable } from '@angular/core';
import { IEntityContentService } from '../entity.types';
import { IImageConfig } from './image-entity.types';
import { FileService } from '../../shared/file-service/file.service';
import { IFileSource } from '../../shared/file-service/file.service.types';

@Injectable({
    providedIn: 'root'
})
export class ImageService extends FileService implements IEntityContentService {

    sources: IFileSource[] = [
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
