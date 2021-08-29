import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { IEntityConfig } from '../../../entity/entity.types';
import { IImageContentConfig } from '../image.content.types';
import { ImageSourceService } from '../../../shared/source-services/image.source.service';
import { ISource } from '../../../shared/source-services/base.source.service.types';

@Component({
    selector: 'app-image-controller',
    templateUrl: './image-controller.component.html'
})
export class ImageControllerComponent {
    @Input() entity: IEntityConfig<IImageContentConfig>;

    @ViewChild('fileInput') fileInputElement: ElementRef<HTMLInputElement>;

    constructor(public imageSourceService: ImageSourceService) {
    }

    onSourceChange(source: ISource): void {
        this.entity.entityContentConfig.source = source;
        this.entity.entityContentConfig.element = this.imageSourceService.getSourceElement(source);
    }
}
