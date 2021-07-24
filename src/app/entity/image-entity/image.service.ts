import { Injectable } from '@angular/core';
import { IEntityContentService } from '../entity.types';
import { IImageConfig, IImageSource } from './image-entity.types';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Injectable({
    providedIn: 'root'
})
export class ImageService implements IEntityContentService {
    imageSources: IImageSource[] = [
        { src: 'assets/image/mako.png' },
        { src: 'assets/image/rain-drop.png' }
    ]

    constructor(private _sanitizer: DomSanitizer) {
    }

    beforeEmit(config: IImageConfig): void {
    }

    getDefaultContent(): IImageConfig {
        return {
            src: this.imageSources[0].src,
            scale: 1,
            opacity: 1
        };
    }

    uploadImageFiles (files: FileList): boolean {
        let addedNewFiles: boolean = false;
        const existingFileNames: string[] = this.imageSources.map(source => source.file?.name).filter(name => !!name)
        Array.from(files).forEach(file => {
            // Check if file already exists
            const index: number = existingFileNames.indexOf(file.name);
            if (index < 0) {
                // Image will be loaded into memory until app is closed/reloaded since we never call URL.revokeObjectURL()
                const objectUrl: string = URL.createObjectURL(file);
                const src: SafeUrl = this._sanitizer.bypassSecurityTrustUrl(objectUrl);
                this.imageSources.push({
                    src,
                    file
                })
                addedNewFiles = true;
            }
        })

        return addedNewFiles;
    }
}
