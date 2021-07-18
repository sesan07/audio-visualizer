export enum EntityType {
    BAR = 'Bar Visualizer',
    BARCLE = 'Barcle Visualizer',
    CIRCLE = 'Circle Visualizer'
}

export interface IBaseEntityConfig {
    type: EntityType;
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

export interface IBaseVisualizerConfig {
    amplitudes: Uint8Array;
    startColorHex: string;
    endColorHex: string;
    multiplier: number;
    opacity: number;
    sampleCount: number;
    scale: number;
    shadowBlur?: number;
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

export type IEntityConfig = IBaseEntityConfig & IVisualizerConfig;
