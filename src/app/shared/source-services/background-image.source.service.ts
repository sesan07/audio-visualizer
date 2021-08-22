import { Injectable } from '@angular/core';
import { BaseSourceService } from './base.source.service';
import { ISource } from './base.source.service.types';
import { DomSanitizer } from '@angular/platform-browser';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable({
    providedIn: 'root'
})
export class BackgroundImageSourceService extends BaseSourceService {
    protected _idPrefix: string = 'bg';

    sources: ISource[] = [
        { name: 'Ryuko and Satsuki', src: 'assets/background-image/1.png' },
    ];

    constructor(sanitizer: DomSanitizer, messageService: NzMessageService) {
        super(sanitizer, messageService);
        this.sources.forEach(source => source.id = `${this._idPrefix}-${this._currIdIndex++}`);
    }
}
