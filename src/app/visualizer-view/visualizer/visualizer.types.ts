export enum VisualizerType {
    BAR = 'Bar',
    BARCLE = 'Barcle',
    CIRCLE = 'Circle'
}

export interface IAppVisualizerConfig {
    type: VisualizerType;
    animationStopTime?: number;
    animateMovement?: boolean;
    animateRotation?: boolean;
    movementAngle?: number;
    movementSpeed?: number;
    rotation: number;
    rotationSpeed?: number;
    startLeft?: number;
    startTop?: number;
    disableColorEdit?: boolean;
    disableAnimation?: boolean;
}

export interface ILibBaseVisualizerConfig {
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

export type ILibVisualizerConfig = IBarVisualizerConfig | IBarcleVisualizerConfig | ICircleVisualizerConfig;

export type IVisualizerConfig = IAppVisualizerConfig & ILibVisualizerConfig;
