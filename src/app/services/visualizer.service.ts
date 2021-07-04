import { Injectable } from '@angular/core';
import { IBaseVisualizerConfig, IVisualizerConfig, VisualizerType } from '../visualizer/visualizer.types';
import { CircleEffect } from 'visualizer';
import { getRandomNumber } from '../shared/utils';
import { AudioService } from './audio.service';

@Injectable({
    providedIn: 'root'
})
export class VisualizerService {
    activeVisualizer: IVisualizerConfig;
    visualizers: IVisualizerConfig[] = [];

    constructor(private _audioService: AudioService) {
    }

    addVisualizer(type: VisualizerType): void {
        const analyserNode = this._audioService.getAnalyser();

        const baseConfig: IBaseVisualizerConfig = {
            type: type,
            analyserNode: analyserNode,
            animationStopTime: 1000,
            audioConfig: this._audioService.selectedAudioConfig,
            startColorHex: '#00b4d8',
            endColorHex: '#ffb703',
            oomph: 1.3,
            scale: 0.2,
            maxDecibels: -20,
            minDecibels: -80,
            mode: 'frequency',
            sampleCount: 16,
            showLowerData: false
        };

        let config: IVisualizerConfig;
        switch (type) {
            case 'Bar':
                config = {
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
                config = {
                    ...baseConfig,
                    baseRadius: 80,
                };
                break;
            case 'Circle':
                config = {
                    ...baseConfig,
                    baseRadius: 80,
                    sampleRadius: 25,
                    effect: CircleEffect.DEFAULT
                };
                break;
            default:
                throw new Error('Unknown visualizer option selected');
        }

        this.visualizers.push(config)

        // Remove visualizer after some time
        setTimeout(() => this.removeVisualizer(config), getRandomNumber(20000, 50000))
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
