export interface IAudioConfig {
    src: string;
    bpm: number;
}

export interface Color {
    red: number;
    green: number;
    blue: number;
}

export type VisualizerMode = 'frequency' | 'timeDomain';
export type VisualizerBarOrientation = 'horizontal' | 'vertical';
