import { CircleEffect, IAudioConfig, VisualizerBarOrientation } from 'visualizer';

export enum VisualizerType {
    BAR = 'Bar',
    BARCLE = 'Barcle',
    CIRCLE = 'Circle'
}

export interface IBaseVisualizerConfig {
    type: VisualizerType;
    audioConfig: IAudioConfig;
    startColorHex: string;
    endColorHex: string;
    oomph: number;
    scale: number;
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
