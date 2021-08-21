import { Injectable } from '@angular/core';
import { EntityType, IEntityConfig, IEntityContentConfig } from './entity.types';
import { AudioService } from '../shared/audio-service/audio.service';
import { VisualizerService } from './visualizer-entity/visualizer.service';
import { IVisualizerConfig } from './visualizer-entity/visualizer-entity.types';
import { ImageService } from './image-entity/image.service';
import { IImageConfig } from './image-entity/image-entity.types';

@Injectable({
    providedIn: 'root'
})
export class EntityService {
    activeEntity: IEntityConfig;
    controllableEntities: IEntityConfig[] = [];
    imageEntities: IEntityConfig<IImageConfig>[] = [];


    // entities: IEntityConfig[] = [];
    emittedEntities: IEntityConfig[] = [];

    private _currNameIndex: number = 0;

    constructor(private _audioService: AudioService,
                private _visualizerService: VisualizerService,
                private _imageService: ImageService) {
    }

    addEntity(type: EntityType, addControllable: boolean, setActive?: boolean): void {
        const entityContent: IEntityContentConfig = this.getDefaultEntityContent(type);
        const entity: IEntityConfig = this.getDefaultEntity(type, entityContent);
        this.setEntityDimensions(entity);
        this.setEntityPosition(entity);

        switch (type) {
            // case EntityType.BAR_VISUALIZER:
            //     this.barVisualizerEntities.push(entity)
            //     break;
            // case EntityType.BARCLE_VISUALIZER:
            //     this.barcleVisualizerEntities.push(entity)
            //     break;
            // case EntityType.CIRCLE_VISUALIZER:
            //     this.circleVisualizerEntities.push(entity)
            //     break;
            case EntityType.IMAGE:
                this.imageEntities.push(entity as IEntityConfig<IImageConfig>)
                break;
        }

        if (addControllable) {
            this.controllableEntities.push(entity)

            if (setActive) {
                this.activeEntity = entity;
            }
        }
    }

    addEmittedEntity(entity: IEntityConfig, autoRemoveTime: number): void {
        this.emittedEntities.push(entity)
        setTimeout(() => this.removeEmittedEntity(entity), autoRemoveTime)
    }

    getDefaultEntity(type: EntityType, content: IEntityContentConfig): IEntityConfig {
        let name: string;
        switch (type) {
            case EntityType.BAR_VISUALIZER:
            case EntityType.BARCLE_VISUALIZER:
            case EntityType.CIRCLE_VISUALIZER:
                name = `Entity ${this._currNameIndex++} (Visualizer)`
                break;
            case EntityType.IMAGE:
                name = `Entity ${this._currNameIndex++} (Image)`
                break;
            default: throw new Error('Unknown entity type')
        }

        return {
            type: type,
            name: name,
            isEmitted: false,
            animateRotation: false,
            animateOomphInEntity: false,
            rotation: 0,
            rotationDirection: 'Right',
            rotationSpeed: 0.5,
            scale: 0.5,
            oomphAmount: 0,
            fadeTime: 1,
            opacity: 1,
            left: 0,
            top: 0,
            height: 0,
            width: 0,
            entityContentConfig: content
        }
    }

    getDefaultEntityContent(type: EntityType): IEntityContentConfig {
        switch (type) {
            case EntityType.BAR_VISUALIZER:
            case EntityType.BARCLE_VISUALIZER:
            case EntityType.CIRCLE_VISUALIZER: return this._visualizerService.getDefaultContent(type, false)
            case EntityType.IMAGE: return this._imageService.getDefaultContent()
            default: throw new Error('Unknown entity type')
        }
    }

    setEntityDimensions(entity: IEntityConfig): void {
        switch (entity.type) {
            case EntityType.BAR_VISUALIZER:
            case EntityType.BARCLE_VISUALIZER:
            case EntityType.CIRCLE_VISUALIZER:
                this._visualizerService.setEntityDimensions(entity as IEntityConfig<IVisualizerConfig>);
                break;
            case EntityType.IMAGE:
                this._imageService.setEntityDimensions(entity as IEntityConfig<IImageConfig>);
                break;
            default: throw new Error('Unknown entity type')
        }
    }

    setEntityPosition(entity: IEntityConfig): void {
        switch (entity.type) {
            case EntityType.BAR_VISUALIZER:
            case EntityType.BARCLE_VISUALIZER:
            case EntityType.CIRCLE_VISUALIZER:
                this._visualizerService.setEntityPosition(entity as IEntityConfig<IVisualizerConfig>);
                break;
            case EntityType.IMAGE:
                this._imageService.setEntityPosition(entity as IEntityConfig<IImageConfig>);
                break;
            default: throw new Error('Unknown entity type')
        }
    }

    removeEntity(entity: IEntityConfig<any>, removeControllable: boolean): void {
        let index: number;
        switch (entity.type) {
            // case EntityType.BAR_VISUALIZER:
            //     index = this.barVisualizerEntities.indexOf(entity);
            //     this.barVisualizerEntities.splice(index, 1);
            //     break;
            // case EntityType.BARCLE_VISUALIZER:
            //     index = this.barcleVisualizerEntities.indexOf(entity);
            //     this.barcleVisualizerEntities.splice(index, 1);
            //     break;
            // case EntityType.CIRCLE_VISUALIZER:
            //     index = this.circleVisualizerEntities.indexOf(entity);
            //     this.circleVisualizerEntities.splice(index, 1);
            //     break;
            case EntityType.IMAGE:
                index = this.imageEntities.indexOf(entity);
                this.imageEntities.splice(index, 1);
                break;
        }

        if (removeControllable) {
            index = this.controllableEntities.indexOf(entity);
            this.controllableEntities.splice(index, 1);

            if (entity === this.activeEntity) {
                this.activeEntity = null;
            }
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
        this.controllableEntities.length = 0; // Empty the array
        this.emittedEntities.length = 0;
        this.controllableEntities.push(...entities);
        this._currNameIndex = entities.length;
    }

    getCleanPreset(entity: IEntityConfig): IEntityConfig {
        const entityClone: IEntityConfig = Object.assign({}, entity)
        delete entityClone.animateOomphInEntity;

        let entityContentClone: IEntityContentConfig;
        switch (entityClone.type) {
            case EntityType.BAR_VISUALIZER:
            case EntityType.BARCLE_VISUALIZER:
            case EntityType.CIRCLE_VISUALIZER:
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
        entityClone.animateOomphInEntity = false

        let entityContentClone: IEntityContentConfig;
        switch (entity.type) {
            case EntityType.BAR_VISUALIZER:
            case EntityType.BARCLE_VISUALIZER:
            case EntityType.CIRCLE_VISUALIZER:
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
            case EntityType.BAR_VISUALIZER:
            case EntityType.BARCLE_VISUALIZER:
            case EntityType.CIRCLE_VISUALIZER:
                name = `Entity ${this._currNameIndex++} (Visualizer)`
                break;
            case EntityType.IMAGE:
                name = `Entity ${this._currNameIndex++} (Image)`
                break;
            default: throw new Error('Unknown entity type')
        }
        entityClone.name = name

        entityClone.entityContentConfig =  Object.assign({}, entityClone.entityContentConfig);
        this.controllableEntities.push(entityClone);
        this.activeEntity = entityClone;
    }
}
