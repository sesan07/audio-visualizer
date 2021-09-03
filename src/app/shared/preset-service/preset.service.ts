import { Injectable } from '@angular/core';
import { Preset } from './preset.service.types';
import { Entity } from '../../entity/entity.types';
import { EntityService } from '../../entity/entity.service';
import { EmitterService } from '../../emitter/emitter.service';
import { Emitter } from '../../emitter/emitter.types';

@Injectable({
    providedIn: 'root'
})
export class PresetService {
    activePreset: Preset;

    get presets(): Preset[] {
        return this._presets.slice();
    }

    private readonly _PRESETS_KEY: string = 'presets';
    private readonly _FIRST_LAUNCH_KEY: string = 'isFirstLaunch';
    private _presets: Preset[] = [];

    constructor(private _entityService: EntityService,
                private _emitterService: EmitterService) {
        // TODO add default presets
        // const isFirstLaunch = localStorage.getItem(this._FIRST_LAUNCH_KEY);
        // if (isFirstLaunch === null) {
        //     this.populateStartingPresets();
        //     // localStorage.setItem(this._FIRST_LAUNCH_KEY, 'false');
        // }

        this._loadPresets();
    }

    saveCurrentAsPreset(name: string): void {
        const entities: Entity[] =
            this._entityService.controllableEntities
                .map(entity => this._entityService.getCleanPreset(entity));
        const emitters: Emitter[] =
            this._emitterService.emitters
                .map(emitter => this._emitterService.getCleanPreset(emitter));

        const preset: Preset = {
            name,
            entities: entities,
            emitters: emitters
        };
        this._presets.push(preset);
        this.activePreset = preset;
        localStorage.setItem(this._PRESETS_KEY, JSON.stringify(this._presets));
    }

    setActivePreset(preset: Preset): void {
        const entities: Entity[] = preset.entities.map(entity => this._entityService.updatePreset(entity));
        const emitters: Emitter[] = preset.emitters.map(emitter => this._emitterService.updatePreset(emitter));

        this._entityService.setEntities(entities);
        this._emitterService.setEmitters(emitters);
        this.activePreset = preset;
    }

    private _loadPresets(): void {
        this._presets = JSON.parse(localStorage.getItem(this._PRESETS_KEY)) ?? [];
        if (this._presets.length > 0) {
            setTimeout(() => this.setActivePreset(this._presets[0]));
        }
    }
}
