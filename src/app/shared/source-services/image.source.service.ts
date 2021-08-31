import { Injectable } from '@angular/core';
import { BaseSourceService } from './base.source.service';
import { Source } from './base.source.service.types';
import { DomSanitizer } from '@angular/platform-browser';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable({
    providedIn: 'root'
})
export class ImageSourceService extends BaseSourceService {

    defaultSource: Source = { name: 'Mako', src: 'assets/image/mako.png' };
    sources: Source[] = [
        this.defaultSource,
        { name: 'Rain Drop', src: 'assets/image/rain-drop.png' }
    ];

    protected _idPrefix = 'img';

    private _imageElements: HTMLImageElement[];

    constructor(sanitizer: DomSanitizer, messageService: NzMessageService) {
        super(sanitizer, messageService);
        this.sources.forEach(source => source.id = `${this._idPrefix}-${this._currIdIndex++}`);
    }

    getSourceElement(source: Source): HTMLImageElement {
        return  this._imageElements.find(element => element.id === source.id)
    }

    setImageElements(imageElements: HTMLImageElement[]): void {
        this._imageElements = imageElements;
    }
}
