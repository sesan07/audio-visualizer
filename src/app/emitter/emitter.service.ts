import { Injectable } from '@angular/core';
import { EmitterType, IEmitterConfig } from './emitter.types';
import { EntityType, IEntityConfig } from '../entity/entity.types';
import { EntityService } from '../entity/entity.service';

@Injectable({
    providedIn: 'root'
})
export class EmitterService {
    emitters: IEmitterConfig[] = [];
    get activeEmitter(): IEmitterConfig {
        return this._activeEmitter;
    }

    private _activeEmitter: IEmitterConfig;
    private _currNameIndex: number = 0;

    constructor(private _entityService: EntityService) {
    }

    addEmitter(type: EmitterType): void {
        const entityType: EntityType = EntityType.BAR;
        const entity: IEntityConfig = this.getDefaultEmitterEntity(entityType);
        this._entityService.setEntityDimensions(entity);
        this._entityService.setEntityPosition(entity);

        const config: IEmitterConfig = {
            type: type,
            isSelected: false,
            name: `Emitter ${this._currNameIndex++}`,
            interval: 2,
            amount: 1,
            lifespan: 5,
            entity: entity
        };
        this.emitters.push(config);
        this.setActiveEmitter(config);
    }

    getDefaultEmitterEntity(type: EntityType): IEntityConfig {
        return {
            type: type,
            isEmitted: true,
            isSelected: false,
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
            currentOpacity: 0,
            targetOpacity: 1,
            left: 0,
            top: 0,
            height: 0,
            width: 0,
            entityContentConfig: this._entityService.getDefaultEntityContent(type, true)
        }
    }

    removeEmitter(emitter: IEmitterConfig): void {
        const index: number = this.emitters.indexOf(emitter);
        this.emitters.splice(index, 1);
        if (emitter === this._activeEmitter) {
            this.setActiveEmitter(null)
        }
    }

    setActiveEmitter(emitter: IEmitterConfig | null) {
        if (emitter) {
            emitter.isSelected = true;
        }
        this._activeEmitter = emitter;

        this.emitters.forEach(e => {
            if (e !== emitter) {
                e.isSelected = false;
            }
        })
    }

    setEmitters(emitters: IEmitterConfig[]): void {
        this.setActiveEmitter(null);
        this.emitters.length = 0; // Empty the array
        this.emitters.push(...emitters);
        this._currNameIndex = emitters.length;
    }

    getCleanPreset(emitter: IEmitterConfig): IEmitterConfig {
        const emitterClone: IEmitterConfig = Object.assign({}, emitter);
        emitterClone.entity = this._entityService.getCleanPreset(emitterClone.entity);
        return emitterClone;
    }

    updatePreset(emitter: IEmitterConfig): IEmitterConfig {
        const emitterClone: IEmitterConfig = Object.assign({}, emitter);
        emitterClone.entity = this._entityService.updatePreset(emitterClone.entity);
        return emitterClone;
    }

    duplicateActive(): void {
        const emitterClone: IEmitterConfig = Object.assign({}, this._activeEmitter);
        emitterClone.name = `Emitter ${this._currNameIndex++}`;
        emitterClone.entity = Object.assign({}, emitterClone.entity);
        emitterClone.entity.entityContentConfig = Object.assign({}, emitterClone.entity.entityContentConfig);
        this.emitters.push(emitterClone);
        this.setActiveEmitter(emitterClone);
    }
}
