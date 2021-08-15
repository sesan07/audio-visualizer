import { IEntityConfig } from '../../entity/entity.types';
import { IEntityEmitterConfig } from '../../entity-emitter/entity-emitter.types';

export interface IPreset {
    name: string;
    entities: IEntityConfig[];
    entityEmitters: IEntityEmitterConfig[];
}