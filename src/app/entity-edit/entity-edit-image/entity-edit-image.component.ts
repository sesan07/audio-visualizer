import { NgForOf, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSliderModule } from 'ng-zorro-antd/slider';

import { ImageContentService } from 'src/app/entity-content/image/image.content.service';
import { ImageContent } from 'src/app/entity-content/image/image.content.types';
import { Entity } from 'src/app/entity-service/entity.types';
import { ControlLineComponent } from 'src/app/shared-components/control-line/control-line.component';
import { SourcePickerComponent } from 'src/app/shared-components/source-picker/source-picker.component';
import { Source } from 'src/app/source-services/base.source.service.types';
import { ImageSourceService } from 'src/app/source-services/image.source.service';

@Component({
    selector: 'app-entity-edit-image',
    standalone: true,
    imports: [
        NgIf,
        NgForOf,
        FormsModule,
        ControlLineComponent,
        SourcePickerComponent,
        NzInputNumberModule,
        NzSliderModule,
    ],
    templateUrl: './entity-edit-image.component.html',
    styleUrls: ['./entity-edit-image.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntityEditImageComponent {
    @Input() entity!: Entity<ImageContent>;

    get content(): ImageContent {
        return this.entity.content;
    }

    @ViewChild('fileInput') fileInputElement!: ElementRef<HTMLInputElement>;

    constructor(public imageSourceService: ImageSourceService, private _imageContentService: ImageContentService) {}

    onSourceChange(source: Source): void {
        this.entity.content.source = source;
        this.entity.content.currGifIndex = 0;
        this.entity.content.speed = 1;
        this._imageContentService.setEntityDimensions(this.entity);
    }
}
