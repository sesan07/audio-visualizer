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
    isEmitted: boolean;
    animationStopTime?: number;
    animateMovement?: boolean;
    animateRotation?: boolean;
    movementAngle?: number;
    movementSpeed?: number;
    rotation: number;
    rotationDirection: 'Left' | 'Right';
    rotationSpeed?: number;
    randomizeMovement?: boolean;
    startLeft?: number;
    startTop?: number;
    disableMovement?: boolean;
    entityContentConfig: IEntityContentConfig;
}

export interface IEntityContentService {
    beforeEmit(config: IEntityContentConfig): void;
    getDefaultContent(contentType?: EntityContentType): IEntityContentConfig;
}
