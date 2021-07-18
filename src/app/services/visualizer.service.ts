import { Injectable } from '@angular/core';
import {
    IAppVisualizerConfig,
    ILibBaseVisualizerConfig,
    ILibVisualizerConfig, IVisualizerConfig,
    VisualizerType
} from '../visualizer-view/visualizer/visualizer.types';
import { AudioService } from './audio.service';
import { EmitterType, IEmitterConfig } from '../visualizer-view/visualizer-emitter/visualizer-emitter.types';
import { getRandomColorHex } from 'visualizer';
import { getRandomNumber } from '../shared/utils';

@Injectable({
    providedIn: 'root'
})
export class VisualizerService {
    activeVisualizer: IVisualizerConfig;
    visualizers: IVisualizerConfig[] = [];
    emittedVisualizers: IVisualizerConfig[] = [];

    emitterCount: number = 0;
    activeEmitter: IEmitterConfig;
    emitters: IEmitterConfig[] = [];

    constructor(private _audioService: AudioService) {
    }

    addVisualizer(type: VisualizerType, setActive?: boolean): void {
        const visualizer: IVisualizerConfig = {
            ...this.getDefaultAppVisualizerConfig(type),
            ...this.getDefaultLibVisualizerConfig(type)
        };
        this.visualizers.push(visualizer)

        if (setActive) {
            this.activeVisualizer = visualizer;
        }
    }

    addEmittedVisualizer(visualizer: IVisualizerConfig, autoRemoveTime: number): void {
        this.emittedVisualizers.push(visualizer)
        setTimeout(() => this.removeEmittedVisualizer(visualizer), autoRemoveTime)
    }

    addEmitter(type: EmitterType): void {
        const randomizeColors = true;
        const visualizer: IVisualizerConfig = {
            ...this.getDefaultAppEmitterVisualizerConfig(VisualizerType.BARCLE),
            ...this.getDefaultLibVisualizerConfig(VisualizerType.BARCLE)
        };
        const config: IEmitterConfig = {
            emitterType: type,
            name: `Emitter (${this.emitterCount++})`,
            interval: 1,
            lifespan: 5,
            randomizeColors: randomizeColors,
            visualizer: visualizer
        }
        this.emitters.push(config);
        this.activeEmitter = config;
    }


    getDefaultLibVisualizerConfig(type: VisualizerType): ILibVisualizerConfig {
        const sampleCount: number = 16;
        const libBaseConfig: ILibBaseVisualizerConfig = {
            amplitudes: this._audioService.getAmplitudes(sampleCount),
            startColorHex: getRandomColorHex(),
            endColorHex: getRandomColorHex(),
            multiplier: 1,
            opacity: 1,
            scale: 1,
            shadowBlur: 5,
            sampleCount: sampleCount
        }

        let visualizer: ILibVisualizerConfig;
        switch (type) {
            case VisualizerType.BAR:
                visualizer = {
                    ...libBaseConfig,
                    barCapSize: 5,
                    barSize: 20,
                    barSpacing: 10,
                    looseCaps: false
                };
                break;
            case VisualizerType.BARCLE:
                visualizer = {
                    ...libBaseConfig,
                    baseRadius: 80,
                    scale: 0.5
                };
                break;
            case VisualizerType.CIRCLE:
                visualizer = {
                    ...libBaseConfig,
                    baseRadius: 80,
                    sampleRadius: 25,
                    scale: 0.5
                };
                break;
            default:
                throw new Error('Unknown visualizer option selected');
        }

        return visualizer;
    }

    getDefaultAppVisualizerConfig(type: VisualizerType): IAppVisualizerConfig {
        return {
            type: type,
            animationStopTime: 1000,
            disableAnimation: true,
            rotation: 0
        }
    }

    getDefaultAppEmitterVisualizerConfig(type: VisualizerType): IAppVisualizerConfig {
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

    removeEmitter(index: number): void {
        const emitter: IEmitterConfig = this.emitters[index];
        this.emitters.splice(index, 1);
        if (emitter === this.activeEmitter) {
            this.activeEmitter = null;
        }
    }

    removeVisualizer(index: number): void {
        const visualizer: IVisualizerConfig = this.visualizers[index];
        this.visualizers.splice(index, 1);
        if (visualizer === this.activeVisualizer) {
            this.activeVisualizer = null;
        }
    }

    removeEmittedVisualizer(visualizer?: IVisualizerConfig): void {
        const index: number = this.emittedVisualizers.indexOf(visualizer);
        if (index !== -1) {
            this.emittedVisualizers.splice(index, 1);
        }
    }
}
