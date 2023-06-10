import { moveItemInArray } from '@angular/cdk/drag-drop';
import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import { BarContentService } from '../entity-content/bar/bar.content.service';
import { BarcleContentService } from '../entity-content/barcle/barcle.content.service';
import { BaseContentService } from '../entity-content/base/base.content.service';
import { CircleContentService } from '../entity-content/circle/circle.content.service';
import { ImageContentService } from '../entity-content/image/image.content.service';
import { PresetService } from '../preset-service/preset.service';
import { Preset } from '../preset-service/preset.service.types';
import { getRandomNumber } from '../utils';
import { Entity, EntityContent, EntityType } from './entity.types';

@Injectable({
    providedIn: 'root',
})
export class EntityService {
    entities$: Observable<Entity[]>;
    emittedEntities$: Observable<Entity[]>;
    activeEntity$: Observable<Entity | null>;

    private _entities$: BehaviorSubject<Entity[]> = new BehaviorSubject<Entity[]>([]);
    private _emittedEntities$: BehaviorSubject<Entity[]> = new BehaviorSubject<Entity[]>([]);
    private _activeEntity$: BehaviorSubject<Entity | null> = new BehaviorSubject<Entity | null>(null);

    private _emitterTimeoutMap: Record<string, ReturnType<typeof setTimeout>> = {};

    constructor(
        private _presetService: PresetService,
        private _barContentService: BarContentService,
        private _barcleContentService: BarcleContentService,
        private _circleContentService: CircleContentService,
        private _imageContentService: ImageContentService
    ) {
        this.entities$ = this._entities$.asObservable();
        this.emittedEntities$ = this._emittedEntities$.asObservable();
        this.activeEntity$ = this._activeEntity$.asObservable();

        _presetService.activePreset$.subscribe(preset => this._loadPreset(preset));
    }

    toggleEmitter(entity: Entity): void {
        entity.isEmitter = !entity.isEmitter;
        if (entity.isEmitter) {
            this._emitEntity(entity);
        } else {
            clearInterval(this._emitterTimeoutMap[entity.id]);
        }
        this._activeEntity$.next(this._activeEntity$.value);
    }

    addEntityType(type: EntityType): void {
        const entityContent: EntityContent = this.getDefaultEntityContent(type, false);
        const entity: Entity = this.getDefaultEntity(type, entityContent, false);
        this.setEntityDimensions(entity);
        this.setEntityPosition(entity);
        this.addEntity(entity);
    }

    addEntity(entity: Entity): void {
        if (entity.isEmitted) {
            this._emittedEntities$.next([...this._emittedEntities$.value, entity]);
        } else {
            this._entities$.next([...this._entities$.value, entity]);
            this.setActiveEntity(entity);
        }

        if (entity.isEmitter) {
            this._emitEntity(entity);
        }
    }

    setEntityType(entity: Entity, type: EntityType): void {
        entity.type = type;
        const entityContent: EntityContent = this.getDefaultEntityContent(type, !!entity.isEmitted);
        entity.content = { ...entityContent };
        this.setEntityDimensions(entity);
        this._activeEntity$.next(this._activeEntity$.value);
    }

    setEntityName(entity: Entity, name: string): void {
        entity.name = name;
        this._activeEntity$.next(this._activeEntity$.value);
    }

    getDefaultEntity(type: EntityType, content: EntityContent, isEmitted: boolean): Entity {
        return {
            id: uuidv4(),
            type,
            isEmitter: false,
            isEmitted,
            name: !isEmitted ? this._getNextName() : undefined,
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
        if (entity.isEmitted) {
            this._emittedEntities$.next(this._emittedEntities$.value.filter(e => e.id !== entity.id));
        } else {
            this._entities$.next(this._entities$.value.filter(e => e.id !== entity.id));

            if (this._activeEntity$.value?.id === entity.id) {
                this.setActiveEntity(null);
            }

            clearInterval(this._emitterTimeoutMap[entity.id]);
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

    setEntities(entities: Entity[]): void {
        this._entities$.next(entities);
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
            ...this._cloneEntity(entity),
            id: uuidv4(),
            name: this._getNextName(),
        };
        this.setEntityDimensions(entityClone);
        this.setEntityPosition(entityClone);
        this.addEntity(entityClone);
    }

    moveEntity(from: number, to: number): void {
        const newEntities: Entity[] = [...this._entities$.value];
        moveItemInArray(newEntities, from, to);
        this._entities$.next(newEntities);
    }

    saveCurrentAsPreset(name: string): void {
        const entities: Entity[] = this._entities$.value.map(entity => this.getAddPreset(entity));
        const preset: Preset = {
            name,
            entities: entities,
        };
        this._presetService.savePreset(name, entities);
    }

    private _getNextName(): string {
        return `Viz ${this._entities$.value.length + 1}`;
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
        const clones: Entity[] = [...Array(entity.emitter.amount).keys()].map(() => this._getEmittedEntity(entity));
        clones.forEach(clone => this.addEntity(clone));
        setTimeout(() => clones.forEach(clone => this.removeEntity(clone)), clones[0].emitter.lifespan);

        this._emitterTimeoutMap[entity.id] = setTimeout(() => this._emitEntity(entity), entity.emitter.interval * 1000);
    }

    private _cloneEntity(entity: Entity): Entity {
        return {
            ...entity,
            content: { ...entity.content },
            transform: structuredClone(entity.transform),
            opacity: structuredClone(entity.opacity),
            emitter: structuredClone(entity.emitter),
        };
    }

    private _getEmittedEntity(entity: Entity): Entity {
        const entityClone: Entity = {
            ...this._cloneEntity(entity),
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
        emitter.spawnTime = Date.now();
        emitter.deathTime = Date.now() + emitter.lifespan;
        this._getContentService(type).beforeEmit(content);

        return entityClone;
    }

    private _loadPreset(preset: Preset | null): void {
        if (!preset) {
            return;
        }

        this._entities$.value.forEach(entity => this.removeEntity(entity));
        this._emittedEntities$.value.forEach(entity => this.removeEntity(entity));
        preset.entities.forEach(entity =>
            this.addEntity({
                ...this.getLoadPreset(entity),
                id: uuidv4(),
            })
        );
        this.setActiveEntity(this._entities$.value[0]);
    }
}
