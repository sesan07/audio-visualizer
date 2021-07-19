import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { IImageConfig, IImageSource } from '../../entity/image-entity/image-entity.types';
import { ImageService } from '../../entity/image-entity/image.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
    selector: 'app-image-controller',
    templateUrl: './image-controller.component.html',
    styleUrls: ['./image-controller.component.css']
})
export class ImageControllerComponent {
    @Input() config: IImageConfig;

    @ViewChild('fileInput') fileInputElement: ElementRef<HTMLInputElement>;

    constructor(public imageService: ImageService, private _messageService: NzMessageService) {
    }

    getImageName(imageSrc: IImageSource): string {
        if (imageSrc.file) {
            return imageSrc.file.name.split('.').shift();

        } else {
            return (imageSrc.src as string).split('/').pop().split('.').shift();
        }
    }

    onFileChange() {
        const files: FileList = this.fileInputElement.nativeElement.files;
        if (this.imageService.uploadImageFiles(files)) {
            this._messageService.success('Upload successful')
        }
    }
}
