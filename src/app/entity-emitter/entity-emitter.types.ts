import { IEntityConfig } from '../entity/entity.types';

export enum EntityEmitterType {
    POINT = 'Point Emitter',
    PAGE = 'Page Emitter'
}

export interface IEntityEmitterConfig {
    emitterType: EntityEmitterType;
    entity: IEntityConfig;
    name: string;
    interval: number;
    lifespan: number;
    randomizeColors: boolean
}