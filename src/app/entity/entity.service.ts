import { Injectable } from '@angular/core';
import { EntityType, IEntityConfig, IEntityContentConfig } from './entity.types';
import { AudioService } from '../shared/audio-service/audio.service';
import { VisualizerService } from './visualizer-entity/visualizer.service';
import { IVisualizerConfig, VisualizerType } from './visualizer-entity/visualizer-entity.types';
import { ImageService } from './image-entity/image.service';
import { IImageConfig } from './image-entity/image-entity.types';

@Injectable({
    providedIn: 'root'
})
export class EntityService {
    activeEntity: IEntityConfig;
    entities: IEntityConfig[] = [];
    emittedEntities: IEntityConfig[] = [];

    private _currNameIndex: number = 0;

    constructor(private _audioService: AudioService,
                private _visualizerService: VisualizerService,
                private _imageService: ImageService) {
    }

    addEntity(type: EntityType): void {
        const entity: IEntityConfig = this.getDefaultEntity(type);
        this.entities.push(entity);
        this.activeEntity = entity;
    }

    addEmittedEntity(entity: IEntityConfig, autoRemoveTime: number): void {
        this.emittedEntities.push(entity)
        setTimeout(() => this.removeEmittedEntity(entity), autoRemoveTime)
    }

    getDefaultEntity(type: EntityType): IEntityConfig {
        let entityContent: IEntityContentConfig;
        let name: string;
        switch (type) {
            case EntityType.VISUALIZER:
                name = `Entity ${this._currNameIndex++} (Visualizer)`
                entityContent = this._visualizerService.getDefaultContent(VisualizerType.BAR)
                break;
            case EntityType.IMAGE:
                name = `Entity ${this._currNameIndex++} (Image)`
                entityContent = this._imageService.getDefaultContent()
                break;
            default: throw new Error('Unknown entity type')
        }

        return {
            type: type,
            name: name,
            isEmitted: false,
            animateRotation: false,
            animateOomphInEntity: type !== EntityType.VISUALIZER,
            rotation: 0,
            rotationDirection: 'Right',
            rotationSpeed: 0.5,
            oomphAmount: 0.8,
            fadeTime: 1,
            entityContentConfig: entityContent
        }
    }

    removeEntity(index: number): void {
        const entity: IEntityConfig = this.entities[index];
        this.entities.splice(index, 1);
        if (entity === this.activeEntity) {
            this.activeEntity = null;
        }
    }

    removeEmittedEntity(entity?: IEntityConfig): void {
        const index: number = this.emittedEntities.indexOf(entity);
        if (index !== -1) {
            this.emittedEntities.splice(index, 1);
        }
    }

    setEntities(entities: IEntityConfig[]): void {
        this.activeEntity = null
        this.entities.length = 0; // Empty the array
        this.emittedEntities.length = 0;
        this.entities.push(...entities);
        this._currNameIndex = entities.length;
    }

    getCleanPreset(entity: IEntityConfig): IEntityConfig {
        const entityClone: IEntityConfig = Object.assign({}, entity)
        delete entityClone.animateOomphInEntity;

        let entityContentClone: IEntityContentConfig;
        switch (entityClone.type) {
            case EntityType.VISUALIZER:
                entityContentClone = this._visualizerService.getCleanPreset(entityClone.entityContentConfig as IVisualizerConfig);
                break;
            case EntityType.IMAGE:
                entityContentClone = this._imageService.getCleanPreset(entityClone.entityContentConfig as IImageConfig);
                break;
        }
        entityClone.entityContentConfig = entityContentClone;

        return entityClone;
    }

    updatePreset(entity: IEntityConfig): IEntityConfig {
        const entityClone: IEntityConfig = Object.assign({}, entity)
        entityClone.animateOomphInEntity = entity.type !== EntityType.VISUALIZER

        let entityContentClone: IEntityContentConfig;
        switch (entity.type) {
            case EntityType.VISUALIZER:
                entityContentClone = this._visualizerService.updatePreset(entityClone.entityContentConfig as IVisualizerConfig)
                break;
            case EntityType.IMAGE:
                entityContentClone = this._imageService.updatePreset(entityClone.entityContentConfig as IImageConfig)
                break;
        }
        entityClone.entityContentConfig = entityContentClone;

        return entityClone;
    }

    duplicateActive(): void {
        const entityClone: IEntityConfig = Object.assign({}, this.activeEntity);

        let name: string;
        switch (entityClone.type) {
            case EntityType.VISUALIZER:
                name = `Entity ${this._currNameIndex++} (Visualizer)`
                break;
            case EntityType.IMAGE:
                name = `Entity ${this._currNameIndex++} (Image)`
                break;
            default: throw new Error('Unknown entity type')
        }
        entityClone.name = name

        entityClone.entityContentConfig =  Object.assign({}, entityClone.entityContentConfig);
        this.entities.push(entityClone);
        this.activeEntity = entityClone;
    }
}
