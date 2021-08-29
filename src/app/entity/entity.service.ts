import { Injectable } from '@angular/core';
import { EntityType, IEntityConfig, IEntityContentConfig } from './entity.types';
import { AudioSourceService } from '../shared/source-services/audio.source.service';
import { IImageContentConfig } from '../entity-content/image/image.content.types';
import { BarContentService } from '../entity-content/bar/bar.content.service';
import { BarcleContentService } from '../entity-content/barcle/barcle.content.service';
import { CircleContentService } from '../entity-content/circle/circle.content.service';
import { ImageContentService } from '../entity-content/image/image.content.service';
import { ICircleContentConfig } from '../entity-content/circle/circle.content.types';
import { IBarContentConfig } from '../entity-content/bar/bar.content.types';
import { IBarcleContentConfig } from '../entity-content/barcle/barcle.content.types';

@Injectable({
    providedIn: 'root'
})
export class EntityService {
    controllableEntities: IEntityConfig[] = [];
    get activeEntity(): IEntityConfig {
        return this._activeEntity;
    }

    private _currNameIndex: number = 0;
    private _activeEntity: IEntityConfig;

    constructor(private _audioService: AudioSourceService,
                private _barContentService: BarContentService,
                private _barcleContentService: BarcleContentService,
                private _circleContentService: CircleContentService,
                private _imageContentService: ImageContentService) {
    }

    addEntity(type: EntityType): void {
        const entityContent: IEntityContentConfig = this.getDefaultEntityContent(type, false);
        const entity: IEntityConfig = this.getDefaultEntity(type, entityContent);
        this.setEntityDimensions(entity);
        this.setEntityPosition(entity);

        this.controllableEntities.push(entity)
        this.setActiveEntity(entity);
    }

    getDefaultEntity(type: EntityType, content: IEntityContentConfig): IEntityConfig {
        return {
            type: type,
            name: this._getNextName(type),
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

    getDefaultEntityContent(type: EntityType, isEmitted: boolean): IEntityContentConfig {
        switch (type) {
            case EntityType.BAR: return this._barContentService.getDefaultContent(isEmitted)
            case EntityType.BARCLE: return this._barcleContentService.getDefaultContent(isEmitted)
            case EntityType.CIRCLE: return this._circleContentService.getDefaultContent(isEmitted)
            case EntityType.IMAGE: return this._imageContentService.getDefaultContent(isEmitted)
            default: throw new Error('Unknown entity type')
        }
    }

    setEntityDimensions(entity: IEntityConfig): void {
        switch (entity.type) {
            case EntityType.BAR:
                this._barContentService.setEntityDimensions(entity as IEntityConfig<IBarContentConfig>);
                break;
            case EntityType.BARCLE:
                this._barcleContentService.setEntityDimensions(entity as IEntityConfig<IBarcleContentConfig>);
                break;
            case EntityType.CIRCLE:
                this._circleContentService.setEntityDimensions(entity as IEntityConfig<ICircleContentConfig>);
                break;
            case EntityType.IMAGE:
                this._imageContentService.setEntityDimensions(entity as IEntityConfig<IImageContentConfig>);
                break;
            default: throw new Error('Unknown entity type')
        }
    }

    setEntityPosition(entity: IEntityConfig, centerX?: number, centerY?: number): void {
        switch (entity.type) {
            case EntityType.BAR:
                this._barContentService.setEntityPosition(entity as IEntityConfig<IBarContentConfig>, centerX, centerY)
                break;
            case EntityType.BARCLE:
                this._barcleContentService.setEntityPosition(entity as IEntityConfig<IBarcleContentConfig>, centerX, centerY)
                break;
            case EntityType.CIRCLE:
                this._circleContentService.setEntityPosition(entity as IEntityConfig<ICircleContentConfig>, centerX, centerY)
                break;
            case EntityType.IMAGE:
                this._imageContentService.setEntityPosition(entity as IEntityConfig<IImageContentConfig>, centerX, centerY)
                break;
            default: throw new Error('Unknown entity type')
        }
    }

    removeEntity(entity: IEntityConfig): void {
        const index = this.controllableEntities.indexOf(entity);
        this.controllableEntities.splice(index, 1);

        if (entity === this._activeEntity) {
            this.setActiveEntity(null)
        }
    }

    setActiveEntity(entity: IEntityConfig | null) {
        if (entity) {
            entity.isSelected = true;
        }
        this._activeEntity = entity;

        this.controllableEntities.forEach(e => {
            if (e !== entity) {
                e.isSelected = false;
            }
        })

    }

    setEntities(entities: IEntityConfig[]): void {
        this._activeEntity = null
        this.controllableEntities.length = 0; // Empty the array
        this.controllableEntities.push(...entities);
        this._currNameIndex = entities.length;
    }

    getCleanPreset(entity: IEntityConfig): IEntityConfig {
        const entityClone: IEntityConfig = Object.assign({}, entity)
        delete entityClone.animateOomphInEntity;

        let entityContentClone: IEntityContentConfig;
        switch (entityClone.type) {
            case EntityType.BAR:
                entityContentClone = this._barContentService.getCleanPreset(entityClone.entityContentConfig as IBarContentConfig)
                break;
            case EntityType.BARCLE:
                entityContentClone = this._barcleContentService.getCleanPreset(entityClone.entityContentConfig as IBarcleContentConfig)
                break;
            case EntityType.CIRCLE:
                entityContentClone = this._circleContentService.getCleanPreset(entityClone.entityContentConfig as ICircleContentConfig)
                break;
            case EntityType.IMAGE:
                entityContentClone = this._imageContentService.getCleanPreset(entityClone.entityContentConfig as IImageContentConfig)
                break;
            default: throw new Error('Unknown entity type')
        }
        entityClone.entityContentConfig = entityContentClone;

        return entityClone;
    }

    updatePreset(entity: IEntityConfig): IEntityConfig {
        const entityClone: IEntityConfig = Object.assign({}, entity)
        entityClone.animateOomphInEntity = false

        let entityContentClone: IEntityContentConfig;
        switch (entityClone.type) {
            case EntityType.BAR:
                entityContentClone = this._barContentService.updatePreset(entityClone.entityContentConfig as IBarContentConfig)
                break;
            case EntityType.BARCLE:
                entityContentClone = this._barcleContentService.updatePreset(entityClone.entityContentConfig as IBarcleContentConfig)
                break;
            case EntityType.CIRCLE:
                entityContentClone = this._circleContentService.updatePreset(entityClone.entityContentConfig as ICircleContentConfig)
                break;
            case EntityType.IMAGE:
                entityContentClone = this._imageContentService.updatePreset(entityClone.entityContentConfig as IImageContentConfig)
                break;
            default: throw new Error('Unknown entity type')
        }
        entityClone.entityContentConfig = entityContentClone;

        return entityClone;
    }

    duplicateActive(): void {
        const entityClone: IEntityConfig = Object.assign({}, this._activeEntity);
        entityClone.name = this._getNextName(entityClone.type);
        entityClone.entityContentConfig =  Object.assign({}, entityClone.entityContentConfig);
        this.setEntityPosition(entityClone);
        this.controllableEntities.push(entityClone);
        this.setActiveEntity(entityClone);
    }

    private _getNextName(type: EntityType): string {
        return `Entity ${this._currNameIndex++} (${type})`
    }
}
