import { SafeUrl } from '@angular/platform-browser';

export type SourceType = 'Default' | 'File' | 'Url';

export interface ISource {
    name: string;
    id?: string;
    src?: string | SafeUrl;
    url?: string;
    file?: File;
    objectUrl?: string;
}