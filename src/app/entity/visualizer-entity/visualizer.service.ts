import { Injectable } from '@angular/core';
import { IEntityContentService } from '../entity.types';
import { IBaseVisualizerConfig, IVisualizerConfig, VisualizerType } from './visualizer-entity.types';
import { AudioService } from '../../shared/audio-service/audio.service';
import { getRandomColorHex } from './visualizer-entity.utils';

@Injectable({
    providedIn: 'root'
})
export class VisualizerService implements IEntityContentService {

    constructor(private _audioService: AudioService) {
    }

    beforeEmit(config: IVisualizerConfig): void {
        // Randomize colors
        if (config.randomizeColors) {
            config.startColorHex = getRandomColorHex();
            config.endColorHex = getRandomColorHex();
        }
    }

    getDefaultContent(visualizerType: VisualizerType, isEmitted: boolean): IVisualizerConfig {
        const sampleCount: number = this._audioService.sampleCounts[0];
        const baseConfig: IBaseVisualizerConfig = {
            type: visualizerType,
            isEmitted: isEmitted,
            randomizeColors: isEmitted,
            amplitudes: this._audioService.getAmplitudes(sampleCount),
            startColorHex: getRandomColorHex(),
            endColorHex: getRandomColorHex(),
            multiplier: 1,
            scale: 0.5,
            shadowBlur: isEmitted ? 0 : 5,
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
                };
                break;
            case VisualizerType.BARCLE:
                visualizer = {
                    ...baseConfig,
                    baseRadius: 80,
                    fillCenter: false,
                    scale: 0.25
                };
                break;
            case VisualizerType.CIRCLE:
                visualizer = {
                    ...baseConfig,
                    baseRadius: 80,
                    sampleRadius: 25,
                    scale: 0.25
                };
                break;
            default: throw new Error('Unknown visualizer type');
        }

        return visualizer;
    }

    getCleanPreset(config: IVisualizerConfig): IVisualizerConfig {
        const visualizerClone = Object.assign({}, config);
        delete visualizerClone.amplitudes;
        return visualizerClone;
    }

    updatePreset(config: IVisualizerConfig): IVisualizerConfig {
        const visualizerClone = Object.assign({}, config);
        visualizerClone.amplitudes = this._audioService.getAmplitudes(visualizerClone.sampleCount);
        return visualizerClone;
    }
}
