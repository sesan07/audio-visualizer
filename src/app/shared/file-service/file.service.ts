import { Injectable } from '@angular/core';
import { IFileSource } from './file.service.types';
import { DomSanitizer } from '@angular/platform-browser';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable({
    providedIn: 'root'
})
export abstract class FileService {
    abstract sources: IFileSource[];
    activeSource: IFileSource;

    constructor(private _sanitizer: DomSanitizer,
                private _messageService: NzMessageService) {
    }

    uploadFiles(files: FileList, loadFile?: boolean) {
        const existingFileNames: string[] = this.sources.map(source => source.file?.name)
        let addedNewFiles: boolean;
        Array.from(files).forEach(file => {
            // Check if file already exists
            const index: number = existingFileNames.indexOf(file.name);
            if (index < 0) {
                const newSource: IFileSource = {
                    file,
                    name: file.name.split('.').shift()
                };

                if (loadFile) {
                    this.loadFileSource(newSource);
                }

                this.sources.push(newSource)
                addedNewFiles = true;
            }
        })

        addedNewFiles ? this._messageService.success('File(s) added') : this._messageService.info('No file added');
    }

    loadFileSource(source: IFileSource) {
        source.objectUrl = URL.createObjectURL(source.file);
        source.src = this._sanitizer.bypassSecurityTrustUrl(source.objectUrl);
    }

    unloadFileSource(source: IFileSource) {
        URL.revokeObjectURL(source.objectUrl)
        source.objectUrl = null;
    }

    setActiveSource(source: IFileSource) {
        if (this.activeSource?.objectUrl) {
            this.unloadFileSource(this.activeSource);
        }

        this.activeSource = source;
        if (this.activeSource.file) {
            this.loadFileSource(this.activeSource);
        }
    }
}
