import { IImageContentConfig } from '../entity-content/image/image.content.types';
import { IBarContentConfig } from '../entity-content/bar/bar.content.types';
import { IBarcleContentConfig } from '../entity-content/barcle/barcle.content.types';
import { ICircleContentConfig } from '../entity-content/circle/circle.content.types';

export enum EntityType {
    BAR = 'Bar',
    BARCLE = 'Barcle',
    CIRCLE = 'Circle',
    IMAGE = 'Image',
}

export type IEntityContentConfig = IBarContentConfig | IBarcleContentConfig | ICircleContentConfig | IImageContentConfig;

export interface IEntityConfig<T extends IEntityContentConfig = IEntityContentConfig> {
    type: EntityType;
    name?: string;
    isEmitted: boolean;
    isSelected?: boolean;
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
    left: number;
    top: number;
    height: number,
    width: number,
    currentOpacity: number;
    targetOpacity: number;
    isDying?: boolean;
    deathTime?: number;
    entityContentConfig: T;
}
