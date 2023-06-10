import { BarContent } from '../entity-content/bar/bar.content.types';
import { BarcleContent } from '../entity-content/barcle/barcle.content.types';
import { CircleContent } from '../entity-content/circle/circle.content.types';
import { ImageContent } from '../entity-content/image/image.content.types';

export enum EntityType {
    BAR = 'Bar',
    BARCLE = 'Barcle',
    CIRCLE = 'Circle',
    IMAGE = 'Image',
}

export type EntityContent = BarContent | BarcleContent | CircleContent | ImageContent;

export interface Entity<T extends EntityContent = EntityContent> {
    id: string;
    type: EntityType;
    name?: string;
    isEmitter: boolean;
    isEmitted?: boolean;
    isSelected?: boolean;
    presetX?: number;
    presetY?: number;
    showResizeCursor?: boolean;
    showMoveCursor?: boolean;
    content: T;
    transform: EntityTransform;
    opacity: EntityOpacity;
    emitter: EntityEmitter;
}

export interface EntityRotation {
    animate?: boolean;
    value: number;
    direction: 'Left' | 'Right';
    randomDirection?: boolean;
    speed: number;
    randomSpeed?: boolean;
    randomSpeedMin: number;
    randomSpeedMax: number;
}

export interface EntityMovement {
    animate?: boolean;
    angle: number;
    randomAngle?: boolean;
    randomAngleMin: number;
    randomAngleMax: number;
    speed: number;
    randomSpeed?: boolean;
    randomSpeedMin: number;
    randomSpeedMax: number;
}

export interface EntityTransform {
    scale: number;
    oomphAmount: number;
    left: number;
    top: number;
    height: number;
    width: number;
    randomPosition?: boolean;
    rotation: EntityRotation;
    movement: EntityMovement;
}

export interface EntityOpacity {
    current: number;
    target: number;
}

export interface EntityEmitter {
    interval: number;
    amount: number;
    lifespan: number;
    randomLifespan?: boolean;
    randomLifespanMin: number;
    randomLifespanMax: number;
    isDying?: boolean;
    deathTime?: number;
    spawnTime?: number;
}
