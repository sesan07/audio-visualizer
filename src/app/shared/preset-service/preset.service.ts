import { Injectable } from '@angular/core';
import { Preset } from './preset.service.types';
import { Entity } from '../../app.types';
import { AppService } from '../../app.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class PresetService {
    activePreset?: Preset;

    get presets(): Preset[] {
        return this._presets.slice();
    }

    private readonly _PRESETS_KEY: string = 'presets';
    private readonly _FIRST_LAUNCH_KEY: string = 'isFirstLaunch';
    private _presets: Preset[] = [];

    constructor(private _entityService: AppService, private _httpClient: HttpClient) {
        const isFirstLaunch: string | null = localStorage.getItem(this._FIRST_LAUNCH_KEY);
        if (isFirstLaunch !== 'false') {
            this._populateDefaultPresets();
            localStorage.setItem(this._FIRST_LAUNCH_KEY, 'false');
        }

        this._loadPresets();
    }

    saveCurrentAsPreset(name: string): void {
        // const entities: Entity[] =
        //     this._entityService.entities
        //         .map(entity => this._entityService.getAddPreset(entity));
        // const emitters: Emitter[] =
        //     this._emitterService.emitters
        //         .map(emitter => this._emitterService.getCleanPreset(emitter));
        // const preset: Preset = {
        //     name,
        //     entities: entities,
        //     emitters: emitters
        // };
        // this._presets.push(preset);
        // this.activePreset = preset;
        // localStorage.setItem(this._PRESETS_KEY, JSON.stringify(this._presets));
    }

    setActivePreset(preset: Preset): void {
        const entities: Entity[] = preset.entities.map(entity => this._entityService.getLoadPreset(entity));

        this._entityService.setEntities(entities);
        this.activePreset = preset;
    }

    private _loadPresets(): void {
        this._presets = JSON.parse(localStorage.getItem(this._PRESETS_KEY) ?? '[]');
    }

    private _populateDefaultPresets(): void {
        this._httpClient.get<Preset[]>('assets/presets.json').subscribe(presets => {
            this._presets = presets;
            localStorage.setItem(this._PRESETS_KEY, JSON.stringify(this._presets));
        });
    }
}
