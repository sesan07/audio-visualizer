import { IVisualizerConfig, VisualizerType } from './visualizer-entity/visualizer-entity.types';
import { IImageConfig } from './image-entity/image-entity.types';

export enum EntityType {
    BAR_VISUALIZER = 'Bar',
    BARCLE_VISUALIZER = 'Barcle',
    CIRCLE_VISUALIZER = 'Circle',
    IMAGE = 'Image',
}

export type IEntityContentConfig = IVisualizerConfig | IImageConfig;

export interface IEntityConfig<T extends IEntityContentConfig = IEntityContentConfig> {
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
    scale: number;
    oomphAmount: number;
    randomizeMovement?: boolean;
    startX?: number;
    startY?: number;
    left: number;
    top: number;
    height: number,
    width: number,
    opacity: number;
    fadeTime: number;
    entityContentConfig: T;
}

export interface IEntityContentService {
    entityView: HTMLElement;
    beforeEmit(config: IEntityContentConfig): void;
    setEntityDimensions(entity: IEntityConfig): void;
    setEntityPosition(entity: IEntityConfig): void;
    getDefaultContent(type?: EntityType, isEmitted?: boolean): IEntityContentConfig;
    getCleanPreset(config: IEntityContentConfig): IEntityContentConfig;
    updatePreset(config: IEntityContentConfig): IEntityContentConfig;
}
