import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Entity } from '../../../entity/entity.types';
import { ImageContent } from '../image.content.types';
import { ImageSourceService } from '../../../shared/source-services/image.source.service';
import { Source } from '../../../shared/source-services/base.source.service.types';
import { ImageContentService } from '../image.content.service';

@Component({
    selector: 'app-image-controller',
    templateUrl: './image-controller.component.html'
})
export class ImageControllerComponent {
    @Input() entity: Entity<ImageContent>;

    @ViewChild('fileInput') fileInputElement: ElementRef<HTMLInputElement>;

    constructor(public imageSourceService: ImageSourceService, private _imageContentService: ImageContentService) {
    }

    onSourceChange(source: Source): void {
        this.entity.entityContent.source = source;
        this.entity.entityContent.element = this.imageSourceService.getSourceElement(source);
        this._imageContentService.setEntityDimensions(this.entity);
    }
}
