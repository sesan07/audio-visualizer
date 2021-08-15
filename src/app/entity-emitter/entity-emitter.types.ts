import { IEntityConfig } from '../entity/entity.types';

export enum EntityEmitterType {
    PAGE = 'Page',
    POINT = 'Point'
}

export interface IEntityEmitterConfig {
    emitterType: EntityEmitterType;
    entity: IEntityConfig;
    name: string;
    interval: number;
    lifespan: number;
    left?: number;
    top?: number;
}