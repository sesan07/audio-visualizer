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
    activeEmitter: IEntityEmitterConfig;
    emitters: IEntityEmitterConfig[] = [];

    private _currNameIndex: number = 0;

    constructor(private _entityService: EntityService,
                private _visualizerService: VisualizerService,
                private _imageService: ImageService) {
    }

    addEmitter(type: EntityEmitterType): void {
        const config: IEntityEmitterConfig = {
            emitterType: type,
            name: `Emitter ${this._currNameIndex++}`,
            interval: 2,
            amount: 1,
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
                entityContent.shadowBlur = 0;
                entityContent.isEmitted = true;
                entityContent.randomizeColors = true;
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
            animateOomphInEntity: type !== EntityType.VISUALIZER,
            movementAngle: 0,
            movementSpeed: 0.5,
            rotation: 0,
            rotationDirection: 'Right',
            rotationSpeed: 0.5,
            oomphAmount: 0.8,
            randomizeMovement: true,
            fadeTime: 1,
            opacity: 1,
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

    setEmitters(emitters: IEntityEmitterConfig[]): void {
        this.activeEmitter = null
        this.emitters.length = 0; // Empty the array
        this.emitters.push(...emitters);
        this._currNameIndex = emitters.length;
    }

    getCleanPreset(emitter: IEntityEmitterConfig): IEntityEmitterConfig {
        const emitterClone: IEntityEmitterConfig = Object.assign({}, emitter);
        emitterClone.entity = this._entityService.getCleanPreset(emitterClone.entity);
        return emitterClone;
    }

    updatePreset(emitter: IEntityEmitterConfig): IEntityEmitterConfig {
        const emitterClone: IEntityEmitterConfig = Object.assign({}, emitter);
        emitterClone.entity = this._entityService.updatePreset(emitterClone.entity);
        return emitterClone;
    }

    duplicateActive(): void {
        const emitterClone: IEntityEmitterConfig = Object.assign({}, this.activeEmitter);
        emitterClone.name = `Emitter ${this._currNameIndex++}`;
        emitterClone.entity = Object.assign({}, emitterClone.entity);
        emitterClone.entity.entityContentConfig = Object.assign({}, emitterClone.entity.entityContentConfig);
        this.emitters.push(emitterClone);
        this.activeEmitter = emitterClone;
    }
}
