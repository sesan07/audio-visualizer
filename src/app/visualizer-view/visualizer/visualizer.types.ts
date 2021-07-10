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
    disableColorEdit?: boolean;
}

export interface ILibBaseVisualizerConfig extends IBaseVisualizerConfig{
    amplitudes: Uint8Array;
    startColorHex: string;
    endColorHex: string;
    multiplier: number;
    opacity: number;
    sampleCount: number;
    scale: number;
    shadowBlur?: number;
}

export interface IBarVisualizerConfig extends ILibBaseVisualizerConfig {
    barCapSize: number;
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
}

export type IVisualizerConfig = IBarVisualizerConfig | IBarcleVisualizerConfig | ICircleVisualizerConfig;
