import { SafeUrl } from '@angular/platform-browser';

export interface IAudioConfig {
    src?: string | SafeUrl;
    file?: File;
    objectUrl?: string;
    isAsset: boolean;
}

export type VisualizerMode = 'frequency' | 'timeDomain';