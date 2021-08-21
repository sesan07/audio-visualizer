import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { IImageConfig } from '../../entity/image-entity/image-entity.types';
import { ImageService } from '../../entity/image-entity/image.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ISource } from '../../shared/source-service/source.service.types';
import { IEntityConfig } from '../../entity/entity.types';

@Component({
    selector: 'app-image-controller',
    templateUrl: './image-controller.component.html',
    styleUrls: ['./image-controller.component.css']
})
export class ImageControllerComponent {
    @Input() entity: IEntityConfig<IImageConfig>;

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

    onSourceChange(source: ISource): void {
        // this.entity.entityContentConfig.name = source.name;
        this.entity.entityContentConfig.element = this.imageService.getSourceElement(source);
    }
}
