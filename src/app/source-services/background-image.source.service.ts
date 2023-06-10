import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { NzMessageService } from 'ng-zorro-antd/message';

import { BaseSourceService } from './base.source.service';
import { Source } from './base.source.service.types';

@Injectable({
    providedIn: 'root',
})
export class BackgroundImageSourceService extends BaseSourceService {
    override sources: Source[] = [{ name: 'V', src: 'assets/background-image/default.jpg' }];

    opacity: number = 0.5;
    oomph: number = 0.2;
    scale: number = 1;

    constructor(sanitizer: DomSanitizer, messageService: NzMessageService) {
        super(sanitizer, messageService);

        this.setActiveSource(this.sources[0]);
    }

    setActiveSource(source: Source): void {
        if (this.activeSource?.objectUrl) {
            this._unloadFileSource(this.activeSource);
        }

        this.activeSource = source;
        if (this.activeSource.file) {
            this._loadFileSource(this.activeSource);
        }
    }

    protected _onSourceAdded(source: Source): void {}
}
