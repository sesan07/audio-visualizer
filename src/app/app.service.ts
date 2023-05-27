import { Injectable } from '@angular/core';
import { EntityType, Entity, EntityContent, EntityLayer } from './app.types';
import { BarContentService } from './entity-content/bar/bar.content.service';
import { BarcleContentService } from './entity-content/barcle/barcle.content.service';
import { CircleContentService } from './entity-content/circle/circle.content.service';
import { ImageContentService } from './entity-content/image/image.content.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { BaseContentService } from './entity-content/base/base.content.service';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { cloneDeep } from 'lodash';
import { getRandomNumber } from './shared/utils';

@Injectable({
    providedIn: 'root',
})
export class AppService {
    layers$: Observable<EntityLayer[]>;
    activeEntity$: Observable<Entity | null>;

    private _layers$: BehaviorSubject<EntityLayer[]> = new BehaviorSubject<EntityLayer[]>([]);
    private _activeEntity$: BehaviorSubject<Entity | null> = new BehaviorSubject<Entity | null>(null);

    private _currNameIndex: number = 0;
    private _emitterTimeoutMap: Record<string, ReturnType<typeof setTimeout>> = {};

    constructor(
        private _barContentService: BarContentService,
        private _barcleContentService: BarcleContentService,
        private _circleContentService: CircleContentService,
        private _imageContentService: ImageContentService
    ) {
        this.layers$ = this._layers$.asObservable();
        this.activeEntity$ = this._activeEntity$.asObservable();
    }

    toggleEmitter(entity: Entity): void {
        if (entity.isEmitter) {
            this._emitEntity(entity);
        } else {
            clearInterval(this._emitterTimeoutMap[entity.id]);
        }
        this._activeEntity$.next(this._activeEntity$.value);
    }

    addNewLayer(): string {
        const layer: EntityLayer = {
            id: uuidv4(),
            name: `Layer ${this._layers$.value.length + 1}`,
            entities: [],
            emittedEntities: [],
        };
        this._layers$.value.push(layer);
        this._layers$.next(this._layers$.value);
        return layer.id;
    }

    addEntityType(type: EntityType, layerId: string): void {
        const entityContent: EntityContent = this.getDefaultEntityContent(type, false);
        const entity: Entity = this.getDefaultEntity(type, entityContent, false, layerId);
        this.setEntityDimensions(entity);
        this.setEntityPosition(entity);
        this.addEntity(entity, layerId);
    }

    addEntity(entity: Entity, layerId: string): void {
        console.log('Add\t', entity.id);
        const layer: EntityLayer = this._getLayer(layerId);
        if (entity.isEmitted) {
            layer.emittedEntities.push(entity);
        } else {
            layer.entities.push(entity);
            this._layers$.next(this._layers$.value);
            this.setActiveEntity(entity);
        }

        if (entity.isEmitter) {
            this._emitEntity(entity);
        }
    }

    getDefaultEntity(type: EntityType, content: EntityContent, isEmitted: boolean, layerId: string): Entity {
        return {
            id: uuidv4(),
            layerId,
            type,
            isEmitter: false,
            isEmitted,
            name: !isEmitted ? this._getNextName(type) : undefined,
            content,
            transform: {
                scale: 0.5,
                oomphAmount: 0,
                left: 0,
                top: 0,
                height: 0,
                width: 0,
                randomPosition: true,
                rotation: {
                    value: 0,
                    direction: 'Right',
                    randomDirection: true,
                    speed: 0.5,
                    randomSpeed: true,
                    randomSpeedMin: 0.1,
                    randomSpeedMax: 2,
                },
                movement: {
                    angle: 0,
                    randomAngle: true,
                    randomAngleMin: 0,
                    randomAngleMax: 360,
                    speed: 0.5,
                    randomSpeed: true,
                    randomSpeedMin: 0.1,
                    randomSpeedMax: 5,
                },
            },
            opacity: {
                current: 0,
                target: 1,
            },
            emitter: {
                interval: 2,
                amount: 1,
                lifespan: 5,
                // randomLifespan: true,
                randomLifespanMin: 0.1,
                randomLifespanMax: 5,
            },
        };
    }

    getDefaultEntityContent(type: EntityType, isEmitted: boolean): EntityContent {
        return this._getContentService(type).getDefaultContent(isEmitted);
    }

    setEntityDimensions(entity: Entity): void {
        this._getContentService(entity.type).setEntityDimensions(entity);
    }

    setEntityPosition(entity: Entity, centerX?: number, centerY?: number): void {
        this._getContentService(entity.type).setEntityPosition(entity, centerX, centerY);
    }

    removeEntity(entity: Entity): void {
        const layer: EntityLayer = this._getLayer(entity.layerId);

        if (entity.isEmitted) {
            // console.log('Remove\t', entity.id);
            layer.emittedEntities = layer.emittedEntities.filter(e => e.id !== entity.id);
        } else {
            // console.log('Remove Main', entity.id);
            layer.entities = layer.entities.filter(e => e.id !== entity.id);
            this._layers$.next(this._layers$.value);

            if (this._activeEntity$.value?.id === entity.id) {
                this.setActiveEntity(null);
            }

            clearInterval(this._emitterTimeoutMap[entity.id]);
        }
    }

    removeLayer(layer: EntityLayer): void {
        this._layers$.next(this._layers$.value.filter(l => l.id !== layer.id));

        if (this._activeEntity$.value?.layerId === layer.id) {
            this.setActiveEntity(null);
        }
    }

    setActiveEntity(entity: Entity | null): void {
        if (this._activeEntity$.value?.isSelected) {
            this._activeEntity$.value.isSelected = false;
        }

        if (entity) {
            entity.isSelected = true;
        }
        this._activeEntity$.next(entity);
    }

    setEntities(entities: Entity[], layerId: string = this._layers$.value[0].id): void {
        this._getLayer(layerId).entities = entities;
        this._layers$.next(this._layers$.value);
        this._currNameIndex = entities.length;
        this.setActiveEntity(null);
    }

    getAddPreset(entity: Entity): Entity {
        const entityClone: Entity = { ...entity };
        delete entityClone.showResizeCursor;
        this._getContentService(entityClone.type).setAddPreset(entityClone);

        return entityClone;
    }

    getLoadPreset(entity: Entity): Entity {
        const entityClone: Entity = { ...entity };
        this._getContentService(entityClone.type).setLoadPreset(entityClone);

        return entityClone;
    }

    duplicateEntity(entity: Entity): void {
        const entityClone: Entity = {
            ...cloneDeep(entity),
            id: uuidv4(),
            name: this._getNextName(entity.type),
        };
        this.setEntityDimensions(entityClone);
        this.setEntityPosition(entityClone);
        this.addEntity(entityClone, entity.layerId);
    }

    moveEntity(entity: Entity, from: number, to: number, layerId?: string): void {
        const layer: EntityLayer = this._getLayer(entity.layerId);
        if (layerId && layerId !== entity.layerId) {
            // transferArrayItem(
            //     event.previousContainer.data,
            //     event.container.data,
            //     event.previousIndex,
            //     event.currentIndex,
            //   );
        } else {
            moveItemInArray(this._getLayer(entity.layerId).entities, from, to);
            this._layers$.next(this._layers$.value);
        }
    }

    moveLayer(from: number, to: number): void {
        const newLayers: EntityLayer[] = [...this._layers$.value];
        moveItemInArray(newLayers, from, to);
        this._layers$.next(newLayers);
    }

    private _getNextName(type: EntityType): string {
        return `Entity ${this._currNameIndex++} (${type})`;
    }

    private _getLayer(id: string): EntityLayer {
        const layer: EntityLayer | undefined = this._layers$.value.find(l => l.id === id);
        if (!layer) {
            throw new Error(`Unable to find layer with id ${id}`);
        } else {
            return layer;
        }
    }

    private _getContentService(type: EntityType): BaseContentService<EntityContent> {
        switch (type) {
            case EntityType.BAR:
                return this._barContentService;
            case EntityType.BARCLE:
                return this._barcleContentService;
            case EntityType.CIRCLE:
                return this._circleContentService;
            case EntityType.IMAGE:
                return this._imageContentService;
            default:
                throw new Error('Unknown entity type');
        }
    }

    private _emitEntity(entity: Entity): void {
        const entityClone: Entity = this._getEmittedEntity(entity);
        this.addEntity(entityClone, entityClone.layerId);
        setTimeout(() => this.removeEntity(entityClone), entityClone.emitter.lifespan);

        this._emitterTimeoutMap[entity.id] = setTimeout(() => this._emitEntity(entity), entity.emitter.interval * 1000);
    }

    private _getEmittedEntity(entity: Entity): Entity {
        const entityClone: Entity = {
            ...cloneDeep(entity),
            id: uuidv4(),
            isEmitter: false,
            isEmitted: true,
            opacity: { ...entity.opacity, current: 0 },
        };

        const { content, emitter, transform, type } = entityClone;

        // Set position
        if (!transform.randomPosition) {
            const centerX: number = transform.left + transform.width / 2;
            const centerY: number = transform.top + transform.height / 2;
            this.setEntityPosition(entityClone, centerX, centerY);
        } else {
            this.setEntityPosition(entityClone);
        }

        // Randomize rotation animation
        const { rotation } = transform;
        if (rotation.animate) {
            if (rotation.randomDirection) {
                rotation.direction = getRandomNumber(0, 2) > 1 ? 'Left' : 'Right';
            }
            if (rotation.randomSpeed) {
                rotation.speed = getRandomNumber(rotation.randomSpeedMin, rotation.randomSpeedMax);
            }
        }

        // Randomize movement animation
        const { movement } = transform;
        if (movement.animate) {
            if (movement.randomAngle) {
                movement.angle = getRandomNumber(movement.randomAngleMin, movement.randomAngleMax);
            }
            if (movement.randomSpeed) {
                movement.speed = getRandomNumber(movement.randomSpeedMin, movement.randomSpeedMax);
            }
        }

        emitter.lifespan = (emitter.randomLifespan ? getRandomNumber(2, 10) : emitter.lifespan) * 1000;
        emitter.deathTime = Date.now() + emitter.lifespan;
        this._getContentService(type).beforeEmit(content);

        return entityClone;
    }
}
