import { IVisualizerConfig } from '../visualizer/visualizer.types';

export enum EmitterType {
    POINT = 'Point',
    PAGE = 'Page'
}

export interface IEmitterConfig {
    emitterType: EmitterType;
    visualizer: IVisualizerConfig;
    name: string;
    interval: number;
    randomizeColors: boolean
}