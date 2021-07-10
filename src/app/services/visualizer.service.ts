import { Injectable } from '@angular/core';
import { IBaseVisualizerConfig, ILibBaseVisualizerConfig, IVisualizerConfig, VisualizerType } from '../visualizer-view/visualizer/visualizer.types';
import { AudioService } from './audio.service';
import { EmitterType, IEmitterConfig } from '../visualizer-view/visualizer-emitter/visualizer-emitter.types';

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
            // startColorHex: '#00b4d8',
            // endColorHex: '#ffb703',
            multiplier: 1,
            scale: 1,
            shadowBlur: 5,
            sampleCount: sampleCount
        }

        let visualizer: IVisualizerConfig;
        switch (type) {
            case 'Bar':
                visualizer = {
                    ...libBaseConfig,
                    barCapSize: 5,
                    barCapColor: '#ffb703',
                    barSize: 20,
                    barSpacing: 10,
                    looseCaps: false
                };
                break;
            case 'Barcle':
                visualizer = {
                    ...libBaseConfig,
                    baseRadius: 80,
                    scale: 0.5
                };
                break;
            case 'Circle':
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
