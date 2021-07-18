import { Injectable } from '@angular/core';
import {
    IBaseEntityConfig,
    IBaseVisualizerConfig,
    IVisualizerConfig, IEntityConfig,
    EntityType
} from './entity.types';
import { AudioService } from '../shared/audio-service/audio.service';
import { getRandomColorHex } from 'visualizer';
import { getRandomNumber } from '../shared/utils';

@Injectable({
    providedIn: 'root'
})
export class EntityService {
    activeVisualizer: IEntityConfig;
    visualizers: IEntityConfig[] = [];
    emittedVisualizers: IEntityConfig[] = [];

    constructor(private _audioService: AudioService) {
    }

    addVisualizer(type: EntityType, setActive?: boolean): void {
        const visualizer: IEntityConfig = {
            ...this.getDefaultAppVisualizerConfig(type),
            ...this.getDefaultLibVisualizerConfig(type)
        };
        this.visualizers.push(visualizer)

        if (setActive) {
            this.activeVisualizer = visualizer;
        }
    }

    addEmittedVisualizer(visualizer: IEntityConfig, autoRemoveTime: number): void {
        this.emittedVisualizers.push(visualizer)
        setTimeout(() => this.removeEmittedVisualizer(visualizer), autoRemoveTime)
    }


    getDefaultLibVisualizerConfig(type: EntityType): IVisualizerConfig {
        const sampleCount: number = 16;
        const libBaseConfig: IBaseVisualizerConfig = {
            amplitudes: this._audioService.getAmplitudes(sampleCount),
            startColorHex: getRandomColorHex(),
            endColorHex: getRandomColorHex(),
            multiplier: 1,
            opacity: 1,
            scale: 1,
            shadowBlur: 5,
            sampleCount: sampleCount
        }

        let visualizer: IVisualizerConfig;
        switch (type) {
            case EntityType.BAR:
                visualizer = {
                    ...libBaseConfig,
                    barCapSize: 5,
                    barSize: 20,
                    barSpacing: 10,
                    looseCaps: false
                };
                break;
            case EntityType.BARCLE:
                visualizer = {
                    ...libBaseConfig,
                    baseRadius: 80,
                    scale: 0.5
                };
                break;
            case EntityType.CIRCLE:
                visualizer = {
                    ...libBaseConfig,
                    baseRadius: 80,
                    sampleRadius: 25,
                    scale: 0.5
                };
                break;
            default:
                throw new Error('Unknown entity option selected');
        }

        return visualizer;
    }

    getDefaultAppVisualizerConfig(type: EntityType): IBaseEntityConfig {
        return {
            type: type,
            animationStopTime: 1000,
            disableAnimation: true,
            rotation: 0
        }
    }

    getDefaultAppEmitterVisualizerConfig(type: EntityType): IBaseEntityConfig {
        return {
            type: type,
            animationStopTime: 1000,
            animateMovement: true,
            animateRotation: true,
            movementAngle: getRandomNumber(0, 360),
            movementSpeed: getRandomNumber(0.5, 2),
            rotation: getRandomNumber(0, 360),
            rotationSpeed: getRandomNumber(0.5, 2),
            disableColorEdit: true
        }
    }

    removeVisualizer(index: number): void {
        const visualizer: IEntityConfig = this.visualizers[index];
        this.visualizers.splice(index, 1);
        if (visualizer === this.activeVisualizer) {
            this.activeVisualizer = null;
        }
    }

    removeEmittedVisualizer(visualizer?: IEntityConfig): void {
        const index: number = this.emittedVisualizers.indexOf(visualizer);
        if (index !== -1) {
            this.emittedVisualizers.splice(index, 1);
        }
    }
}
