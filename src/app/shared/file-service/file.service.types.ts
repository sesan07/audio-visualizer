import { SafeUrl } from '@angular/platform-browser';

export interface IFileSource {
    name: string;
    src?: string | SafeUrl;
    file?: File;
    objectUrl?: string;
}