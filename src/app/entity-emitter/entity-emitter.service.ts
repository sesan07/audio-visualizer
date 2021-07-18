import { Injectable } from '@angular/core';
import { EntityEmitterType, IEntityEmitterConfig } from './entity-emitter.types';
import { EntityType, IEntityConfig } from '../entity/entity.types';
import { EntityService } from '../entity/entity.service';
import { IVisualizerConfig } from '../entity/visualizer-entity/visualizer-entity.types';
import { VisualizerType } from 'visualizer';
import { getRandomNumber } from '../shared/utils';
import { VisualizerService } from '../entity/visualizer-entity/visualizer.service';

@Injectable({
    providedIn: 'root'
})
export class EntityEmitterService {
    emitterCount: number = 0;
    activeEmitter: IEntityEmitterConfig;
    emitters: IEntityEmitterConfig[] = [];

    constructor(private _entityService: EntityService, private _visualizerService: VisualizerService) {
    }

    addEmitter(type: EntityEmitterType): void {
        const config: IEntityEmitterConfig = {
            emitterType: type,
            name: `Emitter (${this.emitterCount++})`,
            interval: 1,
            lifespan: 5,
            entity: this._getDefaultEmitterEntity()
        };
        this.emitters.push(config);
        this.activeEmitter = config;
    }

    private _getDefaultEmitterEntity(): IEntityConfig {
        const visualizer: IVisualizerConfig = this._visualizerService.getDefaultContent(VisualizerType.BAR)
        return {
            type: EntityType.VISUALIZER,
            animationStopTime: 1000,
            animateMovement: true,
            animateRotation: true,
            movementAngle: 0,
            movementSpeed: 0.5,
            rotation: 0,
            rotationSpeed: 0.5,
            randomizeMovement: true,
            entityContentConfig: visualizer
        }
    }

    removeEmitter(index: number): void {
        const emitter: IEntityEmitterConfig = this.emitters[index];
        this.emitters.splice(index, 1);
        if (emitter === this.activeEmitter) {
            this.activeEmitter = null;
        }
    }
}
