interface ISourcePickerData {
    name: string;
}

export interface ISourcePickerFileData extends ISourcePickerData {
    file: File;
}

export interface ISourcePickerUrlData extends ISourcePickerData {
    url: string;
}