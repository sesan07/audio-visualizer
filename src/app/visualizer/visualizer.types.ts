import { CircleEffect, IAudioConfig, VisualizerBarOrientation, VisualizerMode } from 'visualizer';

export enum VisualizerType {
    BAR = 'Bar',
    BARCLE = 'Barcle',
    CIRCLE = 'Circle'
}

export interface IBaseVisualizerConfig {
    type: VisualizerType;
    animationStopTime?: number;
    startLeft?: number;
    startTop?: number;
}

export interface ILibBaseVisualizerConfig extends IBaseVisualizerConfig{
    amplitudes: Uint8Array;
    audioConfig: IAudioConfig;
    startColorHex?: string;
    endColorHex?: string;
    oomph: number;
    scale: number;
    maxDecibels?: number;
    minDecibels?: number;
    sampleCount?: number;
}

export interface IBarVisualizerConfig extends ILibBaseVisualizerConfig{
    barCapSize: number;
    barCapColor: string;
    barOrientation: VisualizerBarOrientation;
    barSize: number;
    barSpacing: number;
    looseCaps: boolean;
}

export interface IBarcleVisualizerConfig extends ILibBaseVisualizerConfig{
    baseRadius: number;
}

export interface ICircleVisualizerConfig extends ILibBaseVisualizerConfig{
    baseRadius: number;
    sampleRadius: number;
    effect: CircleEffect;
}

export type IVisualizerConfig = IBarVisualizerConfig | IBarcleVisualizerConfig | ICircleVisualizerConfig;
