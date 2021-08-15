import { Injectable } from '@angular/core';
import { IPreset } from './preset.service.types';
import { IEntityConfig } from '../../entity/entity.types';
import { EntityService } from '../../entity/entity.service';
import { EntityEmitterService } from '../../entity-emitter/entity-emitter.service';
import { ImageService } from '../../entity/image-entity/image.service';
import { IEntityEmitterConfig } from '../../entity-emitter/entity-emitter.types';

@Injectable({
    providedIn: 'root'
})
export class PresetService {
    activePreset: IPreset;

    get presets(): IPreset[] {
        return this._presets.slice();
    }

    private readonly _PRESETS_KEY: string = 'presets'
    private readonly _FIRST_LAUNCH_KEY: string = 'isFirstLaunch'
    private _presets: IPreset[] = [];

    constructor(private _entityService: EntityService,
                private _entityEmitterService: EntityEmitterService,
                private _imageService: ImageService) {
        // TODO add default presets
        // const isFirstLaunch = localStorage.getItem(this._FIRST_LAUNCH_KEY);
        // if (isFirstLaunch === null) {
        //     this.populateStartingPresets();
        //     // localStorage.setItem(this._FIRST_LAUNCH_KEY, 'false');
        // }

        this._loadPresets()
    }

    saveCurrentAsPreset(name: string): void {
        const entities: IEntityConfig[] =
            this._entityService.entities
                .map(entity => this._entityService.getCleanPreset(entity))
        const entityEmitters: IEntityEmitterConfig[] =
            this._entityEmitterService.emitters
                .map(emitter => this._entityEmitterService.getCleanPreset(emitter))

        const preset: IPreset = {
            name,
            entities: entities,
            entityEmitters: entityEmitters
        }
        this._presets.push(preset);
        this.activePreset = preset;
        localStorage.setItem(this._PRESETS_KEY, JSON.stringify(this._presets));
    }

    setActivePreset(preset: IPreset): void {
        const entities: IEntityConfig[] = preset.entities.map(entity => this._entityService.updatePreset(entity))
        const entityEmitters: IEntityEmitterConfig[] = preset.entityEmitters.map(emitter => this._entityEmitterService.updatePreset(emitter))

        this._entityService.setEntities(entities)
        this._entityEmitterService.setEmitters(entityEmitters)
        this.activePreset = preset;
    }

    private _loadPresets(): void {
        this._presets = JSON.parse(localStorage.getItem(this._PRESETS_KEY)) ?? []
        if (this._presets.length > 0) {
            setTimeout(() => this.setActivePreset(this._presets[0]))
        }
    }
}
