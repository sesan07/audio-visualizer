import { VisualizerType } from 'visualizer';
import { IVisualizerConfig } from './visualizer-entity/visualizer-entity.types';

export enum EntityType {
    VISUALIZER = 'Visualizer',
}

export type EntityContentType = VisualizerType;
export type IEntityContentConfig = IVisualizerConfig;

export interface IEntityConfig<I = IEntityContentConfig> {
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
    disableRotationEdit?: boolean;
    disableAnimation?: boolean;
    entityContentConfig: I;
}

export interface IEntityContentService<T = EntityContentType, C = IEntityContentConfig> {
    beforeEmit(config: C): void;
    getDefaultContent(contentType: T): C;
}
