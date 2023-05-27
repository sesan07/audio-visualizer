import { ImageContent } from './entity-content/image/image.content.types';
import { BarContent } from './entity-content/bar/bar.content.types';
import { BarcleContent } from './entity-content/barcle/barcle.content.types';
import { CircleContent } from './entity-content/circle/circle.content.types';

export enum EntityType {
    BAR = 'Bar',
    BARCLE = 'Barcle',
    CIRCLE = 'Circle',
    IMAGE = 'Image',
}

export type EntityContent = BarContent | BarcleContent | CircleContent | ImageContent;

// export interface Viz<T extends EntityContent = EntityContent> {
export interface Entity<T extends EntityContent = EntityContent> {
    id: string;
    layerId: string;
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
    transform: VizTransform;
    opacity: VizOpacity;
    emitter: VizEmitter;
}

export interface VizRotation {
    animate?: boolean;
    value: number;
    direction: 'Left' | 'Right'; // TODO lowercase
    randomDirection?: boolean;
    speed: number;
    randomSpeed?: boolean;
    randomSpeedMin: number;
    randomSpeedMax: number;
}

export interface VizMovement {
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

export interface VizTransform {
    scale: number;
    oomphAmount: number;
    left: number;
    top: number;
    height: number;
    width: number;
    randomPosition?: boolean;
    rotation: VizRotation;
    movement: VizMovement;
}

export interface VizOpacity {
    current: number;
    target: number;
}

export interface VizEmitter {
    interval: number;
    amount: number;
    lifespan: number;
    randomLifespan?: boolean;
    randomLifespanMin: number;
    randomLifespanMax: number;
    isDying?: boolean;
    deathTime?: number;
}

// export interface Entity<T extends EntityContent = EntityContent> {
//     type: EntityType;
//     id: string;
//     layerId: string;
//     name?: string;
//     isEmitted?: boolean;
//     isSelected?: boolean;
//     animateRotation?: boolean;
//     movementAngle: number;
//     movementSpeed: number;
//     rotation: number;
//     rotationDirection: 'Left' | 'Right';
//     rotationSpeed: number;
//     scale: number;
//     oomphAmount: number;
//     left: number;
//     top: number;
//     height: number;
//     width: number;
//     currentOpacity: number;
//     targetOpacity: number;
//     isDying?: boolean;
//     deathTime?: number;
//     entityContent: T;
//     presetX?: number;
//     presetY?: number;
//     showResizeCursor?: boolean;
//     showMoveCursor?: boolean;
//     canEmit: boolean;
//     emitterConfig: EntityEmitter;
// }

export interface EntityEmitter {
    interval: number;
    amount: number;
    lifespan: number;
    randomizeLifespan?: boolean;
    randomizePosition?: boolean;
    randomizeMovement?: boolean;
    randomizeMovementAngle?: boolean;
    randomizeMovementSpeed?: boolean;
    animateMovement?: boolean;
}

export interface EntityLayer {
    id: string;
    name: string;
    entities: Entity[];
    emittedEntities: Entity[];
}
