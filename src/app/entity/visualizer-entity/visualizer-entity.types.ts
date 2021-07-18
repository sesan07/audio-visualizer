import { VisualizerType } from 'visualizer';

export interface IBaseVisualizerConfig {
    type: VisualizerType,
    amplitudes: Uint8Array;
    startColorHex: string;
    endColorHex: string;
    multiplier: number;
    opacity: number;
    sampleCount: number;
    scale: number;
    shadowBlur?: number;
    randomizeColors: boolean;
}

export interface IBarVisualizerConfig extends IBaseVisualizerConfig {
    barCapSize: number;
    barSize: number;
    barSpacing: number;
    looseCaps: boolean;
}

export interface IBarcleVisualizerConfig extends IBaseVisualizerConfig{
    baseRadius: number;
}

export interface ICircleVisualizerConfig extends IBaseVisualizerConfig{
    baseRadius: number;
    sampleRadius: number;
}

export type IVisualizerConfig = IBarVisualizerConfig | IBarcleVisualizerConfig | ICircleVisualizerConfig;