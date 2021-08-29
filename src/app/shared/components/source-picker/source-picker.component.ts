import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ISourcePickerFileData, ISourcePickerUrlData } from './source-picker.component.types';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ISource, SourceType } from '../../source-services/base.source.service.types';

@Component({
    selector: 'app-source-picker',
    templateUrl: './source-picker.component.html',
    styleUrls: ['./source-picker.component.css']
})
export class SourcePickerComponent {
    @Input() activeSource: ISource;
    @Input() allowFileAdd: boolean;
    @Input() allowUrlAdd: boolean;
    @Input() fileAcceptTypes: string;
    @Input() popoverTitle: string;
    @Input() sources: ISource[];
    @Output() activeSourceChanged: EventEmitter<ISource> = new EventEmitter();
    @Output() addFile: EventEmitter<ISourcePickerFileData> = new EventEmitter();
    @Output() addUrl: EventEmitter<ISourcePickerUrlData> = new EventEmitter();

    @ViewChild('fileInput') fileInputElement: ElementRef<HTMLInputElement>;

    form: FormGroup;
    sourceType: SourceType = this.addFile ? 'File' : 'Url';
    isPopoverVisible: boolean;

    private _fileValidator = (control: FormControl): { [s: string]: boolean } => {
        if (this.sourceType === 'File' && !control.value) {
            return { required: true };
        }
        return {};
    };

    private _urlValidator = (control: FormControl): { [s: string]: boolean } => {
        if (this.sourceType === 'Url' && !control.value) {
            return { required: true };
        }
        return {};
    };

    constructor(private _formBuilder: FormBuilder) {
    }

    ngOnInit(): void {
        this.form = this._formBuilder.group({
            name: ['', [Validators.required]],
            file: ['', [this._fileValidator]],
            url: ['', [this._urlValidator]]
        });
    }

    get fileName(): string {
        return this.fileInputElement?.nativeElement.files.item(0)?.name.split('/').shift();
    }

    onPopoverSubmit() {
        switch (this.sourceType) {
            case 'File':
                const fileData: ISourcePickerFileData = {
                    name: this.form.value.name,
                    file: this.fileInputElement.nativeElement.files.item(0)
                }
                this.addFile.emit(fileData)
                break;
            case 'Url':
                const urlData: ISourcePickerUrlData = {
                    name: this.form.value.name,
                    url: this.form.value.url
                }
                this.addUrl.emit(urlData)
                break;

        }
        this.isPopoverVisible = false;
        this.form.reset();
    }

    onSourceTypeChange(): void {
        this.form.controls.file.setValue('');
        this.form.controls.url.setValue('');
    }

    onPopoverClose(): void {
        this.isPopoverVisible = false;
        this.form.reset();
    }

    onPopOverVisibleChange(): void {
        if (!this.isPopoverVisible) {
            this.form.reset();
        }
    }
}
