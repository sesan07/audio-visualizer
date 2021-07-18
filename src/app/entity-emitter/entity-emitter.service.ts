import { Injectable } from '@angular/core';
import { EntityEmitterType, IEntityEmitterConfig } from './entity-emitter.types';
import { IEntityConfig, EntityType } from '../entity/entity.types';
import { EntityService } from '../entity/entity.service';

@Injectable({
    providedIn: 'root'
})
export class EntityEmitterService {
    emitterCount: number = 0;
    activeEmitter: IEntityEmitterConfig;
    emitters: IEntityEmitterConfig[] = [];

    constructor(private _entityService: EntityService) {
    }

    addEmitter(type: EntityEmitterType): void {
        const randomizeColors = true;
        const visualizer: IEntityConfig = {
            ...this._entityService.getDefaultAppEmitterVisualizerConfig(EntityType.BARCLE),
            ...this._entityService.getDefaultLibVisualizerConfig(EntityType.BARCLE)
        };
        const config: IEntityEmitterConfig = {
            emitterType: type,
            name: `Emitter (${this.emitterCount++})`,
            interval: 1,
            lifespan: 5,
            randomizeColors: randomizeColors,
            entity: visualizer
        };
        this.emitters.push(config);
        this.activeEmitter = config;
    }

    removeEmitter(index: number): void {
        const emitter: IEntityEmitterConfig = this.emitters[index];
        this.emitters.splice(index, 1);
        if (emitter === this.activeEmitter) {
            this.activeEmitter = null;
        }
    }
}
