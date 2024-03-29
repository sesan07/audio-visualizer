import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { NzMessageService } from 'ng-zorro-antd/message';

import { Source } from './base.source.service.types';

@Injectable({
    providedIn: 'root',
})
export abstract class BaseSourceService {
    sources: Source[] = [];
    activeSource?: Source;

    protected constructor(private _sanitizer: DomSanitizer, private _messageService: NzMessageService) {}

    addFileSource(name: string, file: File): void {
        if (!file) {
            this._showNotification(false);
            return;
        }

        // Check if file already exists
        const existingFileNames: string[] = this.sources.map(source => source.file?.name ?? '');
        const isNewFile: boolean = existingFileNames.indexOf(file.name) < 0;
        if (isNewFile) {
            const newSource: Source = {
                name,
                file,
            };

            this.sources.push(newSource);
            this._onSourceAdded(newSource);
        }

        this._showNotification(isNewFile);
    }

    // TODO add store/load url sources with localstorage
    addUrlSource(name: string, url: string): void {
        if (!url) {
            this._showNotification(false);
            return;
        }

        const existingSource: Source | undefined = this.sources.find(source => source.src === url);
        if (existingSource) {
            existingSource.name = name || url.split('/').pop()!;
        } else {
            const newSource: Source = {
                name,
                url,
                src: url,
            };

            this.sources.push(newSource);
            this._onSourceAdded(newSource);
        }
        this._showNotification(true);
    }

    protected abstract _onSourceAdded(source: Source): void;

    protected _loadFileSource(source: Source): void {
        source.objectUrl = URL.createObjectURL(source.file!);
        source.src = this._sanitizer.bypassSecurityTrustUrl(source.objectUrl);
    }

    protected _unloadFileSource(source: Source): void {
        URL.revokeObjectURL(source.objectUrl!);
        source.objectUrl = undefined;
    }

    private _showNotification(isSuccessful: boolean): void {
        isSuccessful ? this._messageService.success('Source added') : this._messageService.info('No source added');
    }
}
