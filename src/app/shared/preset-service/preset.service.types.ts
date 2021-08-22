import { IEntityConfig } from '../../entity/entity.types';
import { IEmitterConfig } from '../../emitter/emitter.types';

export interface IPreset {
    name: string;
    entities: IEntityConfig[];
    emitters: IEmitterConfig[];
}