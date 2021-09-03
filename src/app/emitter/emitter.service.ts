import { Injectable } from '@angular/core';
import { EmitterType, Emitter } from './emitter.types';
import { EntityType, Entity, EntityContent } from '../entity/entity.types';
import { EntityService } from '../entity/entity.service';

@Injectable({
    providedIn: 'root'
})
export class EmitterService {
    emitters: Emitter[] = [];

    get activeEmitter(): Emitter {
        return this._activeEmitter;
    }

    private _activeEmitter: Emitter;
    private _currNameIndex: number = 0;

    constructor(private _entityService: EntityService) {
    }

    addEmitter(type: EmitterType): void {
        const entityType: EntityType = EntityType.BAR;
        const entityContent: EntityContent = this._entityService.getDefaultEntityContent(entityType, true);
        const entity: Entity = this._entityService.getDefaultEntity(entityType, entityContent, true);
        this._entityService.setEntityDimensions(entity);
        this._entityService.setEntityPosition(entity);

        const emitter: Emitter = {
            type: type,
            isSelected: false,
            name: `Emitter ${this._currNameIndex++}`,
            interval: 2,
            amount: 1,
            lifespan: 5,
            entity: entity
        };
        this.emitters.push(emitter);
        this.setActiveEmitter(emitter);
    }

    removeEmitter(emitter: Emitter): void {
        const index: number = this.emitters.indexOf(emitter);
        this.emitters.splice(index, 1);
        if (emitter === this._activeEmitter) {
            this.setActiveEmitter(null);
        }
    }

    setActiveEmitter(emitter: Emitter | null): void {
        if (emitter) {
            emitter.isSelected = true;
        }
        this._activeEmitter = emitter;

        this.emitters.forEach(e => {
            if (e !== emitter) {
                e.isSelected = false;
            }
        });
    }

    setEmitters(emitters: Emitter[]): void {
        this.setActiveEmitter(null);
        this.emitters.length = 0; // Empty the array
        this.emitters.push(...emitters);
        this._currNameIndex = emitters.length;
    }

    getCleanPreset(emitter: Emitter): Emitter {
        const emitterClone: Emitter = Object.assign({}, emitter);
        emitterClone.entity = this._entityService.getCleanPreset(emitterClone.entity);
        return emitterClone;
    }

    updatePreset(emitter: Emitter): Emitter {
        const emitterClone: Emitter = Object.assign({}, emitter);
        emitterClone.entity = this._entityService.updatePreset(emitterClone.entity);
        return emitterClone;
    }

    duplicateActive(): void {
        const emitterClone: Emitter = Object.assign({}, this._activeEmitter);
        emitterClone.name = `Emitter ${this._currNameIndex++}`;
        emitterClone.entity = Object.assign({}, emitterClone.entity);
        emitterClone.entity.entityContent = Object.assign({}, emitterClone.entity.entityContent);
        this.emitters.push(emitterClone);
        this.setActiveEmitter(emitterClone);
    }
}
