import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { IImageConfig } from '../../entity/image-entity/image-entity.types';
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

    addUrlPopOverVisible: boolean;

    constructor(public imageService: ImageService, private _messageService: NzMessageService) {
    }

    onFileUpload(): void {
        const files: FileList = this.fileInputElement.nativeElement.files;
        this.imageService.addFileSources(files, true);
    }

    onAddUrl(url?: string, name?: string): void {
        this.imageService.addUrlSource(url, name);
        this.addUrlPopOverVisible = false;
    }
}
