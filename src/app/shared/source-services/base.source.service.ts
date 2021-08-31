import { Injectable } from '@angular/core';
import { Source } from './base.source.service.types';
import { DomSanitizer } from '@angular/platform-browser';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable({
    providedIn: 'root'
})
export abstract class BaseSourceService {
    sources: Source[] = [];
    activeSource: Source;

    protected abstract _idPrefix : string;
    protected _currIdIndex: number = 0;

    protected constructor(private _sanitizer: DomSanitizer,
                private _messageService: NzMessageService) {
    }

    addFileSource(name: string, file: File, loadFile?: boolean): void {
        if (!file) {
            this._showNotification(false);
            return;
        }

        // Check if file already exists
        const existingFileNames: string[] = this.sources.map(source => source.file?.name)
        const isNewFile: boolean = existingFileNames.indexOf(file.name) < 0;
        if (isNewFile) {
            const newSource: Source = {
                name,
                file,
                id: `${this._idPrefix}-${this._currIdIndex++}`,
            };

            if (loadFile) {
                this.loadFileSource(newSource);
            }

            this.sources.push(newSource)
        }

        this._showNotification(isNewFile);
    }

    addUrlSource(name: string, url: string): void {
        if (!url) {
            this._showNotification(false)
            return;
        }

        const existingSource: Source = this.sources.find(source => source.src === url)
        if (existingSource) {
            existingSource.name = name || url.split('/').pop()
        } else {
            this.sources.push({
                url,
                id: `${this._idPrefix}-${this._currIdIndex++}`,
                src: url,
                name: name || url.split('/').pop()
            })
        }
        this._showNotification(true)
    }

    loadFileSource(source: Source): void {
        source.objectUrl = URL.createObjectURL(source.file);
        source.src = this._sanitizer.bypassSecurityTrustUrl(source.objectUrl);
    }

    unloadFileSource(source: Source): void {
        URL.revokeObjectURL(source.objectUrl)
        source.objectUrl = null;
    }

    setActiveSource(source: Source): void {
        if (this.activeSource?.objectUrl) {
            this.unloadFileSource(this.activeSource);
        }

        this.activeSource = source;
        if (this.activeSource.file) {
            this.loadFileSource(this.activeSource);
        }
    }

    private _showNotification(isSuccessful): void {
        isSuccessful ? this._messageService.success('Source added') : this._messageService.info('No source added');
    }
}
