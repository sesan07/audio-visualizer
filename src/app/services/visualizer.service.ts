import { Injectable } from '@angular/core';
import { IBaseVisualizerConfig, ILibBaseVisualizerConfig, IVisualizerConfig, VisualizerType } from '../visualizer/visualizer.types';
import { CircleEffect } from 'visualizer';
import { AudioService } from './audio.service';
import { EmitterType, IEmitterConfig } from '../visualizer-emitter/visualizer-emitter.types';

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

    addVisualizer(visualizer: IVisualizerConfig, setActive?: boolean): void {
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
        const config: IEmitterConfig = {
            emitterType: type,
            name: `Emitter (${this.emitterCount++})`,
            interval: 1000,
            visualizer: this.getDefaultVisualizer(VisualizerType.BARCLE)
        }
        this.emitters.push(config);
        this.activeEmitter = config;
    }

    getDefaultVisualizer(type: VisualizerType): IVisualizerConfig {
        const sampleCount: number = 16;
        const baseConfig: IBaseVisualizerConfig = { type };
        const libBaseConfig: ILibBaseVisualizerConfig = {
            ...baseConfig,
            amplitudes: this._audioService.getAmplitudes(sampleCount),
            animationStopTime: 1000,
            audioConfig: this._audioService.selectedAudioConfig,
            // startColorHex: '#00b4d8',
            // endColorHex: '#ffb703',
            oomph: 1.3,
            scale: 0.2,
            shadowBlur: 5,
            maxDecibels: -20,
            minDecibels: -80,
            sampleCount: sampleCount
        }

        let visualizer: IVisualizerConfig;
        switch (type) {
            case 'Bar':
                visualizer = {
                    ...libBaseConfig,
                    barCapSize: 5,
                    barCapColor: '#ffb703',
                    barOrientation: 'horizontal',
                    barSize: 20,
                    barSpacing: 2,
                    looseCaps: false,
                    scale: 0.5
                };
                break;
            case 'Barcle':
                visualizer = {
                    ...libBaseConfig,
                    baseRadius: 80,
                };
                break;
            case 'Circle':
                visualizer = {
                    ...libBaseConfig,
                    baseRadius: 80,
                    sampleRadius: 25,
                    effect: CircleEffect.DEFAULT
                };
                break;
            default:
                throw new Error('Unknown visualizer option selected');
        }

        return visualizer;
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
