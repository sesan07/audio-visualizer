import { IAudioConfig } from 'visualizer';

export interface IBaseVisualizerConfig {
    type: string;
    audioConfig: IAudioConfig;
    startColorHex: string;
    endColorHex: string;
    oomph: number;
    scale: number;
}
