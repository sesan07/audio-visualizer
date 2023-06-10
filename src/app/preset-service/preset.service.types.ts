import { Entity } from '../entity-service/entity.types';

export interface Preset {
    name: string;
    entities: Entity[];
}
