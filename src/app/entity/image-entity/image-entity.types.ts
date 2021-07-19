import { SafeUrl } from '@angular/platform-browser';

export interface IImageConfig {
    src: string | SafeUrl,
    scale: number,
    opacity: number
}

export interface IImageSource {
    src?: string | SafeUrl;
    file?: File;
}