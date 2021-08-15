import { IVisualizerConfig, VisualizerType } from './visualizer-entity/visualizer-entity.types';
import { IImageConfig } from './image-entity/image-entity.types';

export enum EntityType {
    VISUALIZER = 'Visualizer',
    IMAGE = 'Image',
}

export type EntityContentType = VisualizerType;
export type IEntityContentConfig = IVisualizerConfig | IImageConfig;

export interface IEntityConfig {
    type: EntityType;
    name?: string;
    isEmitted: boolean;
    animateMovement?: boolean;
    animateRotation?: boolean;
    animateOomphInEntity: boolean;
    movementAngle?: number;
    movementSpeed?: number;
    rotation: number;
    rotationDirection: 'Left' | 'Right';
    rotationSpeed?: number;
    oomphAmount: number;
    randomizeMovement?: boolean;
    startX?: number;
    startY?: number;
    left?: number;
    top?: number;
    opacity: number;
    fadeTime: number;
    entityContentConfig: IEntityContentConfig;
}

export interface IEntityContentService {
    beforeEmit(config: IEntityContentConfig): void;
    getDefaultContent(contentType?: EntityContentType): IEntityContentConfig;
    getCleanPreset(config: IEntityContentConfig): IEntityContentConfig;
    updatePreset(config: IEntityContentConfig): IEntityContentConfig;
}
