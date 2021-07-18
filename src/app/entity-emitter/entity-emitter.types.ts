import { IEntityConfig } from '../entity/entity.types';

export enum EntityEmitterType {
    PAGE = 'Page Emitter',
    POINT = 'Point Emitter'
}

export interface IEntityEmitterConfig {
    emitterType: EntityEmitterType;
    entity: IEntityConfig;
    name: string;
    interval: number;
    lifespan: number;
    randomizeColors: boolean
}