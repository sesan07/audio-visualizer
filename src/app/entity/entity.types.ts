import { VisualizerType } from 'visualizer';
import { IVisualizerConfig } from './visualizer-entity/visualizer-entity.types';

export enum EntityType {
    VISUALIZER = 'Visualizer',
}

export type EntityContentType = VisualizerType;
export type IEntityContentConfig = IVisualizerConfig;

export interface IEntityConfig {
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
    entityContentConfig: IEntityContentConfig;
}

export interface IEntityContentService {
    beforeEmit(config: IEntityContentConfig): void;
    getDefaultContent(contentType: EntityContentType): IEntityContentConfig;
}
