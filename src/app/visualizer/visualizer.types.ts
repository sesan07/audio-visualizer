import { CircleEffect, IAudioConfig, VisualizerBarOrientation, VisualizerMode } from 'visualizer';

export enum VisualizerType {
    BAR = 'Bar',
    BARCLE = 'Barcle',
    CIRCLE = 'Circle'
}

export interface IBaseVisualizerConfig {
    type: VisualizerType;
    analyserNode: AnalyserNode;
    audioConfig: IAudioConfig;
    startColorHex: string;
    endColorHex: string;
    oomph: number;
    scale: number;
    maxDecibels?: number;
    minDecibels?: number;
    mode?: VisualizerMode;
    sampleCount?: number;
    showLowerData?: boolean;
}

export interface IBarVisualizerConfig extends IBaseVisualizerConfig{
    barCapSize: number;
    barCapColor: string;
    barOrientation: VisualizerBarOrientation;
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
    effect: CircleEffect;
}

export type IVisualizerConfig = IBarVisualizerConfig | IBarcleVisualizerConfig | ICircleVisualizerConfig;
