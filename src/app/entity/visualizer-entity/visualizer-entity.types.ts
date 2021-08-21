import { EntityType } from '../entity.types';
import { RGB } from 'ngx-color';

export type VisualizerType = EntityType.BAR_VISUALIZER | EntityType.BARCLE_VISUALIZER | EntityType.CIRCLE_VISUALIZER

export interface IBaseVisualizerConfig {
    isEmitted: boolean;
    amplitudes: Uint8Array;
    startColor: RGB;
    endColor: RGB;
    multiplier: number;
    sampleCount: number;
    shadowBlur?: number;
    randomizeColors: boolean;
    opacity: number;
}

export interface IBarVisualizerConfig extends IBaseVisualizerConfig {
    barCapSize: number;
    barSize: number;
    barSpacing: number;
}

export interface IBarcleVisualizerConfig extends IBaseVisualizerConfig{
    baseRadius: number;
    fillCenter: boolean;
}

export interface ICircleVisualizerConfig extends IBaseVisualizerConfig{
    baseRadius: number;
    sampleRadius: number;
}

export type IVisualizerConfig = IBarVisualizerConfig | IBarcleVisualizerConfig | ICircleVisualizerConfig;