import { Injectable } from '@angular/core';
import { IBaseVisualizerConfig, ILibBaseVisualizerConfig, IVisualizerConfig, VisualizerType } from '../visualizer/visualizer.types';
import { CircleEffect } from 'visualizer';
import { getRandomNumber } from '../shared/utils';
import { AudioService } from './audio.service';
import { EmitterType, IEmitterConfig } from '../visualizer-emitter/visualizer-emitter.types';

@Injectable({
    providedIn: 'root'
})
export class VisualizerService {
    activeVisualizer: IVisualizerConfig;
    visualizers: IVisualizerConfig[] = [];

    emitterCount: number = 0;
    activeEmitter: IEmitterConfig;
    emitters: IEmitterConfig[] = [];

    constructor(private _audioService: AudioService) {
    }

    addVisualizer(config: IBaseVisualizerConfig, setActive?: boolean): void {
        const sampleCount: number = 16;
        const baseConfig: ILibBaseVisualizerConfig = {
            ...config,
            amplitudes: this._audioService.getAmplitudes(sampleCount),
            animationStopTime: 1000,
            audioConfig: this._audioService.selectedAudioConfig,
            // startColorHex: '#00b4d8',
            // endColorHex: '#ffb703',
            oomph: 1.3,
            scale: 0.2,
            maxDecibels: -20,
            minDecibels: -80,
            mode: 'frequency',
            sampleCount: sampleCount,
            showLowerData: false
        };

        let visualizer: IVisualizerConfig;
        switch (config.type) {
            case 'Bar':
                visualizer = {
                    ...baseConfig,
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
                    ...baseConfig,
                    baseRadius: 80,
                };
                break;
            case 'Circle':
                visualizer = {
                    ...baseConfig,
                    baseRadius: 80,
                    sampleRadius: 25,
                    effect: CircleEffect.DEFAULT
                };
                break;
            default:
                throw new Error('Unknown visualizer option selected');
        }

        this.visualizers.push(visualizer)
        if (setActive) {
            this.activeVisualizer = visualizer;
        }

        // Remove visualizer after some time
        setTimeout(() => this.removeVisualizer(visualizer), getRandomNumber(5000, 10000))
    }

    addEmitter(type: EmitterType): void {
        const config: IEmitterConfig = {
            emitterType: type,
            name: `Emitter (${this.emitterCount++})`,
            interval: 1000,
            visualizerType: VisualizerType.BARCLE
        }
        this.emitters.push(config);
        this.activeEmitter = config;
    }

    removeEmitter(emitter?: IEmitterConfig): void {
        emitter = emitter ?? this.activeEmitter;
        const index: number = this.emitters.indexOf(emitter);
        if (index !== -1) {
            this.emitters.splice(index, 1);
            if (emitter === this.activeEmitter) {
                this.activeEmitter = null;
            }
        }
    }

    removeVisualizer(visualizer?: IVisualizerConfig): void {
        visualizer = visualizer ?? this.activeVisualizer;
        const index: number = this.visualizers.indexOf(visualizer);
        if (index !== -1) {
            this.visualizers.splice(index, 1);
            if (visualizer === this.activeVisualizer) {
                this.activeVisualizer = null;
            }
        }
    }
}
