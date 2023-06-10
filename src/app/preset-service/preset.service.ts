import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, ReplaySubject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import { Entity } from '../entity-service/entity.types';
import { Preset } from './preset.service.types';

@Injectable({
    providedIn: 'root',
})
export class PresetService {
    activePreset$: Observable<Preset | null>;

    get presets(): Preset[] {
        return this._presets.slice();
    }

    private readonly _VERSION_KEY: string = 'version';
    private readonly _PRESETS_KEY_V1: string = 'presets_v1';
    private readonly _PRESETS_KEY_V0: string = 'presets';
    private readonly _FIRST_LAUNCH_KEY: string = 'isFirstLaunch';
    private _presets: Preset[] = [];

    private _activePreset$: ReplaySubject<Preset> = new ReplaySubject(1);

    constructor(private _httpClient: HttpClient) {
        this.activePreset$ = this._activePreset$.asObservable();

        const isFirstLaunch: string | null = localStorage.getItem(this._FIRST_LAUNCH_KEY);
        if (isFirstLaunch !== 'false') {
            this._populateDefaultPresets();
            localStorage.setItem(this._FIRST_LAUNCH_KEY, 'false');
            localStorage.setItem(this._VERSION_KEY, '1');
        }

        const version: string | null = localStorage.getItem(this._VERSION_KEY);
        if (version !== '1') {
            this._upgradeFromV0();
            localStorage.setItem(this._VERSION_KEY, '1');
        }
        this._presets = JSON.parse(localStorage.getItem(this._PRESETS_KEY_V1) ?? '[]');
    }

    savePreset(name: string, entities: Entity[]): void {
        const preset: Preset = {
            name,
            entities,
        };
        this._presets.push(preset);
        this._activePreset$.next(preset);
        localStorage.setItem(this._PRESETS_KEY_V1, JSON.stringify(this._presets));
    }

    setActivePreset(preset: Preset = this._presets[0]): void {
        this._activePreset$.next(preset);
    }

    private _populateDefaultPresets(): void {
        this._httpClient.get<Preset[]>('assets/presets.json').subscribe(presets => {
            this._presets = presets;
            this.setActivePreset();
            localStorage.setItem(this._PRESETS_KEY_V1, JSON.stringify(this._presets));
        });
    }

    private _upgradeFromV0(): void {
        let presets: any[] = JSON.parse(localStorage.getItem(this._PRESETS_KEY_V0) ?? '[]');
        presets = presets.map(preset => ({
            name: preset.name,
            entities: [
                ...preset.entities.map((entity: any) => this._convertEntityFromV0(entity)),
                ...preset.emitters.map((emitter: any) => this._convertEmitterFromV0(emitter)),
            ],
        }));
        localStorage.setItem(this._PRESETS_KEY_V1, JSON.stringify(presets));
    }

    private _convertEntityFromV0(entity: any): Entity {
        return {
            id: uuidv4(),
            type: entity.type,
            name: entity.name,
            isEmitter: false,
            presetX: entity.presetX,
            presetY: entity.presetY,
            content: {
                ...entity.entityContent,
                randomStartColor: entity.entityContent.randomizeColors,
                randomEndColor: entity.entityContent.randomizeColors,
            },
            transform: {
                scale: entity.scale,
                oomphAmount: entity.oomphAmount,
                left: entity.left,
                top: entity.top,
                height: entity.height,
                width: entity.width,
                rotation: {
                    animate: entity.animateRotation,
                    value: entity.rotation,
                    direction: entity.rotationDirection,
                    randomDirection: true,
                    speed: entity.rotationSpeed,
                    randomSpeed: true,
                    randomSpeedMin: 0.1,
                    randomSpeedMax: 2,
                },
                movement: {
                    angle: entity.movementAngle,
                    randomAngle: entity.randomizeMovement,
                    randomAngleMin: 0,
                    randomAngleMax: 360,
                    speed: entity.movementSpeed,
                    randomSpeed: true,
                    randomSpeedMin: 0.1,
                    randomSpeedMax: 5,
                },
            },
            opacity: {
                current: entity.currentOpacity,
                target: entity.targetOpacity,
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

    private _convertEmitterFromV0(emitter: any): Entity {
        const entity: Entity = this._convertEntityFromV0(emitter.entity);
        return {
            ...entity,
            name: emitter.name,
            isEmitter: true,
            transform: {
                ...entity.transform,
                randomPosition: emitter.type === 'Page',
            },
            emitter: {
                interval: emitter.interval,
                amount: emitter.amount,
                lifespan: emitter.lifespan,
                randomLifespanMin: 0.1,
                randomLifespanMax: 5,
            },
        };
    }
}
