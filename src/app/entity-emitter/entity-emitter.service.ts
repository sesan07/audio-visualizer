import { Injectable } from '@angular/core';
import { EntityEmitterType, IEntityEmitterConfig } from './entity-emitter.types';
import { EntityType, IEntityConfig, IEntityContentConfig } from '../entity/entity.types';
import { EntityService } from '../entity/entity.service';
import { VisualizerService } from '../entity/visualizer-entity/visualizer.service';
import { ImageService } from '../entity/image-entity/image.service';

@Injectable({
    providedIn: 'root'
})
export class EntityEmitterService {
    activeEmitter: IEntityEmitterConfig;
    emitters: IEntityEmitterConfig[] = [];

    // TODO look into controlling emitted entities in here

    private _currNameIndex: number = 0;

    constructor(private _entityService: EntityService,
                private _visualizerService: VisualizerService,
                private _imageService: ImageService) {
    }

    addEmitter(type: EntityEmitterType): void {
        const entityType: EntityType = EntityType.BAR_VISUALIZER;
        const entityContent: IEntityContentConfig = this.getDefaultEntityContent(entityType);
        const entity: IEntityConfig = this.getDefaultEmitterEntity(entityType);
        this._entityService.setEntityDimensions(entity);
        this._entityService.setEntityPosition(entity);

        const config: IEntityEmitterConfig = {
            emitterType: type,
            name: `Emitter ${this._currNameIndex++}`,
            interval: 2,
            amount: 1,
            lifespan: 5,
            entity: entity
        };
        this.emitters.push(config);
        this.activeEmitter = config;
    }

    getDefaultEmitterEntity(type: EntityType): IEntityConfig {
        return {
            type: type,
            isEmitted: true,
            animateMovement: true,
            animateRotation: true,
            animateOomphInEntity: false,
            movementAngle: 0,
            movementSpeed: 0.5,
            rotation: 0,
            rotationDirection: 'Right',
            rotationSpeed: 0.5,
            scale: 0.5,
            oomphAmount: 0,
            randomizeMovement: true,
            fadeTime: 1,
            opacity: 1,
            left: 0,
            top: 0,
            height: 0,
            width: 0,
            entityContentConfig: this.getDefaultEntityContent(type)
        }
    }

    getDefaultEntityContent(type: EntityType): IEntityContentConfig {
        switch (type) {
            case EntityType.BAR_VISUALIZER:
            case EntityType.BARCLE_VISUALIZER:
            case EntityType.CIRCLE_VISUALIZER: return this._visualizerService.getDefaultContent(type, true)
            case EntityType.IMAGE: return this._imageService.getDefaultContent()
            default: throw new Error('Unknown entity type')
        }
    }

    removeEmitter(emitter: IEntityEmitterConfig): void {
        const index: number = this.emitters.indexOf(emitter);
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
