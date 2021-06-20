import { IBaseVisualizerConfig } from '../base-visualizer/base-visualizer.types';
import { CircleEffect } from 'visualizer';

export interface ICircleVisualizerConfig extends IBaseVisualizerConfig{
    baseRadius: number;
    sampleRadius: number;
    effect: CircleEffect;
}
