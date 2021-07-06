import { VisualizerType } from '../visualizer/visualizer.types';

export enum EmitterType {
    POINT = 'Point',
    PAGE = 'Page'
}

export interface IEmitterConfig {
    emitterType: EmitterType;
    visualizerType: VisualizerType;
    name: string;
    interval: number;
}