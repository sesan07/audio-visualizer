import { ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Entity } from '../../../app.types';
import { ImageContent } from '../image.content.types';
import { ImageSourceService } from '../../../shared/source-services/image.source.service';
import { Source } from '../../../shared/source-services/base.source.service.types';
import { ImageContentService } from '../image.content.service';
import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { ControlLineComponent } from 'src/app/shared/components/control-line/control-line.component';
import { SourcePickerComponent } from 'src/app/shared/components/source-picker/source-picker.component';

@Component({
    selector: 'app-image-controller',
    standalone: true,
    imports: [
        // CommonModule,
        NgIf,
        NgForOf,
        FormsModule,
        ControlLineComponent,
        SourcePickerComponent,
        NzInputNumberModule,
        NzSliderModule,
    ],
    templateUrl: './image-controller.component.html',
    styleUrls: ['./image-controller.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageControllerComponent {
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
