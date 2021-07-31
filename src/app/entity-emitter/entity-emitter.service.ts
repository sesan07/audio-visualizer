import { Injectable } from '@angular/core';
import { EntityEmitterType, IEntityEmitterConfig } from './entity-emitter.types';
import { EntityType, IEntityConfig, IEntityContentConfig } from '../entity/entity.types';
import { EntityService } from '../entity/entity.service';
import { VisualizerType } from '../entity/visualizer-entity/visualizer-entity.types';
import { VisualizerService } from '../entity/visualizer-entity/visualizer.service';
import { ImageService } from '../entity/image-entity/image.service';

@Injectable({
    providedIn: 'root'
})
export class EntityEmitterService {
    emitterCount: number = 0;
    activeEmitter: IEntityEmitterConfig;
    emitters: IEntityEmitterConfig[] = [];

    constructor(private _entityService: EntityService,
                private _visualizerService: VisualizerService,
                private _imageService: ImageService) {
    }

    addEmitter(type: EntityEmitterType): void {
        const config: IEntityEmitterConfig = {
            emitterType: type,
            name: `Emitter (${this.emitterCount++})`,
            interval: 1,
            lifespan: 5,
            entity: this.getDefaultEmitterEntity(EntityType.VISUALIZER)
        };
        this.emitters.push(config);
        this.activeEmitter = config;
    }

    getDefaultEmitterEntity(type: EntityType): IEntityConfig {
        let entityContent: IEntityContentConfig;
        switch (type) {
            case EntityType.VISUALIZER:
                entityContent = this._visualizerService.getDefaultContent(VisualizerType.BAR)
                break;
            case EntityType.IMAGE:
                entityContent = this._imageService.getDefaultContent()
                break;
            default: throw new Error('Unknown entity type')
        }

        return {
            type: type,
            isEmitted: true,
            animateMovement: true,
            animateRotation: true,
            animateOomph: true,
            movementAngle: 0,
            movementSpeed: 0.5,
            rotation: 0,
            rotationDirection: 'Right',
            rotationSpeed: 0.5,
            oomphAmount: 0.8,
            randomizeMovement: true,
            fadeTime: 1,
            disableFadeEdit: false,
            entityContentConfig: entityContent
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
