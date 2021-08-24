import { IEntityConfig } from '../entity/entity.types';

export enum EmitterType {
    PAGE = 'Page',
    POINT = 'Point'
}

export interface IEmitterConfig {
    type: EmitterType;
    entity: IEntityConfig;
    name: string;
    interval: number;
    amount: number;
    lifespan: number;
    left?: number;
    top?: number;
}