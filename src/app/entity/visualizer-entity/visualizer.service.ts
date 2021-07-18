import { Injectable } from '@angular/core';
import { IEntityContentService } from '../entity.types';
import { IBaseVisualizerConfig, IVisualizerConfig } from './visualizer-entity.types';
import { getRandomColorHex, VisualizerType } from 'visualizer';
import { AudioService } from '../../shared/audio-service/audio.service';

@Injectable({
    providedIn: 'root'
})
export class VisualizerService implements IEntityContentService<VisualizerType, IVisualizerConfig> {

    constructor(private _audioService: AudioService) {
    }

    beforeEmit(config: IVisualizerConfig): void {
        // Randomize colors
        if (config.randomizeColors) {
            config.startColorHex = getRandomColorHex();
            config.endColorHex = getRandomColorHex();
        }
    }

    getDefaultContent(visualizerType: VisualizerType): IVisualizerConfig {
        const sampleCount: number = 16;
        const baseConfig: IBaseVisualizerConfig = {
            type: visualizerType,
            randomizeColors: true,
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
        switch (visualizerType) {
            case VisualizerType.BAR:
                visualizer = {
                    ...baseConfig,
                    barCapSize: 5,
                    barSize: 20,
                    barSpacing: 10,
                    looseCaps: false
                };
                break;
            case VisualizerType.BARCLE:
                visualizer = {
                    ...baseConfig,
                    baseRadius: 80,
                    scale: 0.5
                };
                break;
            case VisualizerType.CIRCLE:
                visualizer = {
                    ...baseConfig,
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
}
