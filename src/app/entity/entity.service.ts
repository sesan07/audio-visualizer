import { Injectable } from '@angular/core';
import { EntityType, Entity, EntityContent } from './entity.types';
import { AudioSourceService } from '../shared/source-services/audio.source.service';
import { ImageContent } from '../entity-content/image/image.content.types';
import { BarContentService } from '../entity-content/bar/bar.content.service';
import { BarcleContentService } from '../entity-content/barcle/barcle.content.service';
import { CircleContentService } from '../entity-content/circle/circle.content.service';
import { ImageContentService } from '../entity-content/image/image.content.service';
import { CircleContent } from '../entity-content/circle/circle.content.types';
import { BarContent } from '../entity-content/bar/bar.content.types';
import { BarcleContent } from '../entity-content/barcle/barcle.content.types';

@Injectable({
    providedIn: 'root'
})
export class EntityService {
    controllableEntities: Entity[] = [];

    get activeEntity(): Entity {
        return this._activeEntity;
    }

    private _activeEntity: Entity;
    private _currNameIndex: number = 0;

    constructor(private _audioService: AudioSourceService,
                private _barContentService: BarContentService,
                private _barcleContentService: BarcleContentService,
                private _circleContentService: CircleContentService,
                private _imageContentService: ImageContentService) {
    }

    addEntity(type: EntityType): void {
        const entityContent: EntityContent = this.getDefaultEntityContent(type, false);
        const entity: Entity = this.getDefaultEntity(type, entityContent);
        this.setEntityDimensions(entity);
        this.setEntityPosition(entity);

        this.controllableEntities.push(entity);
        this.setActiveEntity(entity);
    }

    getDefaultEntity(type: EntityType, content: EntityContent): Entity {
        return {
            type: type,
            name: this._getNextName(type),
            isEmitted: false,
            isSelected: false,
            animateRotation: false,
            animateOomphInEntity: false,
            rotation: 0,
            rotationDirection: 'Right',
            rotationSpeed: 0.5,
            scale: 0.5,
            oomphAmount: 0,
            currentOpacity: 0,
            targetOpacity: 1,
            left: 0,
            top: 0,
            height: 0,
            width: 0,
            entityContent: content
        };
    }

    getDefaultEntityContent(type: EntityType, isEmitted: boolean): EntityContent {
        switch (type) {
            case EntityType.BAR:
                return this._barContentService.getDefaultContent(isEmitted);
            case EntityType.BARCLE:
                return this._barcleContentService.getDefaultContent(isEmitted);
            case EntityType.CIRCLE:
                return this._circleContentService.getDefaultContent(isEmitted);
            case EntityType.IMAGE:
                return this._imageContentService.getDefaultContent(isEmitted);
            default:
                throw new Error('Unknown entity type');
        }
    }

    setEntityDimensions(entity: Entity): void {
        switch (entity.type) {
            case EntityType.BAR:
                this._barContentService.setEntityDimensions(entity as Entity<BarContent>);
                break;
            case EntityType.BARCLE:
                this._barcleContentService.setEntityDimensions(entity as Entity<BarcleContent>);
                break;
            case EntityType.CIRCLE:
                this._circleContentService.setEntityDimensions(entity as Entity<CircleContent>);
                break;
            case EntityType.IMAGE:
                this._imageContentService.setEntityDimensions(entity as Entity<ImageContent>);
                break;
            default:
                throw new Error('Unknown entity type');
        }
    }

    setEntityPosition(entity: Entity, centerX?: number, centerY?: number): void {
        switch (entity.type) {
            case EntityType.BAR:
                this._barContentService.setEntityPosition(entity as Entity<BarContent>, centerX, centerY);
                break;
            case EntityType.BARCLE:
                this._barcleContentService.setEntityPosition(entity as Entity<BarcleContent>, centerX, centerY);
                break;
            case EntityType.CIRCLE:
                this._circleContentService.setEntityPosition(entity as Entity<CircleContent>, centerX, centerY);
                break;
            case EntityType.IMAGE:
                this._imageContentService.setEntityPosition(entity as Entity<ImageContent>, centerX, centerY);
                break;
            default:
                throw new Error('Unknown entity type');
        }
    }

    removeEntity(entity: Entity): void {
        const index = this.controllableEntities.indexOf(entity);
        this.controllableEntities.splice(index, 1);

        if (entity === this._activeEntity) {
            this.setActiveEntity(null);
        }
    }

    setActiveEntity(entity: Entity | null): void {
        if (entity) {
            entity.isSelected = true;
        }
        this._activeEntity = entity;

        this.controllableEntities.forEach(e => {
            if (e !== entity) {
                e.isSelected = false;
            }
        });
    }

    setEntities(entities: Entity[]): void {
        this._activeEntity = null;
        this.controllableEntities.length = 0; // Empty the array
        this.controllableEntities.push(...entities);
        this._currNameIndex = entities.length;
    }

    getCleanPreset(entity: Entity): Entity {
        const entityClone: Entity = Object.assign({}, entity);
        delete entityClone.animateOomphInEntity;

        let entityContentClone: EntityContent;
        switch (entityClone.type) {
            case EntityType.BAR:
                entityContentClone = this._barContentService.getCleanPreset(entityClone.entityContent as BarContent);
                break;
            case EntityType.BARCLE:
                entityContentClone = this._barcleContentService.getCleanPreset(entityClone.entityContent as BarcleContent);
                break;
            case EntityType.CIRCLE:
                entityContentClone = this._circleContentService.getCleanPreset(entityClone.entityContent as CircleContent);
                break;
            case EntityType.IMAGE:
                entityContentClone = this._imageContentService.getCleanPreset(entityClone.entityContent as ImageContent);
                break;
            default:
                throw new Error('Unknown entity type');
        }
        entityClone.entityContent = entityContentClone;

        return entityClone;
    }

    updatePreset(entity: Entity): Entity {
        const entityClone: Entity = Object.assign({}, entity);
        entityClone.animateOomphInEntity = false;

        let entityContentClone: EntityContent;
        switch (entityClone.type) {
            case EntityType.BAR:
                entityContentClone = this._barContentService.updatePreset(entityClone.entityContent as BarContent);
                break;
            case EntityType.BARCLE:
                entityContentClone = this._barcleContentService.updatePreset(entityClone.entityContent as BarcleContent);
                break;
            case EntityType.CIRCLE:
                entityContentClone = this._circleContentService.updatePreset(entityClone.entityContent as CircleContent);
                break;
            case EntityType.IMAGE:
                entityContentClone = this._imageContentService.updatePreset(entityClone.entityContent as ImageContent);
                break;
            default:
                throw new Error('Unknown entity type');
        }
        entityClone.entityContent = entityContentClone;

        return entityClone;
    }

    duplicateActive(): void {
        const entityClone: Entity = Object.assign({}, this._activeEntity);
        entityClone.name = this._getNextName(entityClone.type);
        entityClone.entityContent = Object.assign({}, entityClone.entityContent);
        this.setEntityPosition(entityClone);
        this.controllableEntities.push(entityClone);
        this.setActiveEntity(entityClone);
    }

    private _getNextName(type: EntityType): string {
        return `Entity ${this._currNameIndex++} (${type})`;
    }
}
