import { Component, Input } from '@angular/core';
import { IImageConfig } from './image-entity.types';

@Component({
    selector: 'app-image-entity',
    templateUrl: './image-entity.component.html',
    styleUrls: ['./image-entity.component.css']
})
export class ImageEntityComponent {
    @Input() config: IImageConfig;
}
