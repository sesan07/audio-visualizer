import { Injectable } from '@angular/core';
import { EntityType, IEntityConfig, IEntityContentService } from '../entity.types';
import {
    IBarcleVisualizerConfig,
    IBarVisualizerConfig,
    IBaseVisualizerConfig,
    ICircleVisualizerConfig,
    IVisualizerConfig,
    VisualizerType
} from './visualizer-entity.types';
import { AudioService } from '../../shared/audio-service/audio.service';
import { getRandomColor } from './visualizer-entity.utils';
import { getRandomNumber } from '../../shared/utils';

@Injectable({
    providedIn: 'root'
})
export class VisualizerService implements IEntityContentService {
    entityView: HTMLElement;

    constructor(private _audioService: AudioService) {
    }

    beforeEmit(config: IVisualizerConfig): void {
        // Randomize colors
        if (config.randomizeColors) {
            config.startColor = getRandomColor();
            config.endColor = getRandomColor();
        }
    }

    getDefaultContent(type: VisualizerType, isEmitted: boolean): IVisualizerConfig {
        const sampleCount: number = this._audioService.sampleCounts[0];
        const baseConfig: IBaseVisualizerConfig = {
            // type: type,
            isEmitted: isEmitted,
            randomizeColors: isEmitted,
            amplitudes: this._audioService.getAmplitudes(sampleCount),
            startColor: getRandomColor(),
            endColor: getRandomColor(),
            multiplier: 1,
            shadowBlur: isEmitted ? 0 : 5,
            sampleCount: sampleCount,
            opacity: 1
        }

        let config: IVisualizerConfig;
        switch (type) {
            case EntityType.BAR_VISUALIZER:
                config = {
                    ...baseConfig,
                    barCapSize: 5,
                    barSize: 20,
                    barSpacing: 10,
                };
                break;
            case EntityType.BARCLE_VISUALIZER:
                config = {
                    ...baseConfig,
                    baseRadius: 80,
                    fillCenter: false,
                };
                break;
            case EntityType.CIRCLE_VISUALIZER:
                config = {
                    ...baseConfig,
                    baseRadius: 80,
                    sampleRadius: 25,
                };
                break;
            default: throw new Error('Unknown visualizer type');
        }

        // this.setDimensions(type, config)
        // this.setPosition(config);

        return config;
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

    setEntityDimensions(entity: IEntityConfig<IVisualizerConfig>): void {
        switch (entity.type) {
            case EntityType.BAR_VISUALIZER:
                this._setBarDimensions(entity as IEntityConfig<IBarVisualizerConfig>);
                break;
            case EntityType.BARCLE_VISUALIZER:
                this._setBarcleDimensions(entity as IEntityConfig<IBarcleVisualizerConfig>);
                break;
            case EntityType.CIRCLE_VISUALIZER:
                this._setCircleDimensions(entity as IEntityConfig<ICircleVisualizerConfig>);
                break;
        }
    }

    setEntityPosition(entity: IEntityConfig<IVisualizerConfig>): void {
        entity.left = getRandomNumber(0, this.entityView.clientWidth - entity.width)
        entity.top = getRandomNumber(0, this.entityView.clientHeight - entity.height)
    }

    private _setBarDimensions(entity: IEntityConfig<IBarVisualizerConfig>): void {
        const config: IBarVisualizerConfig = entity.entityContentConfig;

        const barHeight: number = config.multiplier * 255;
        const barCapHeight: number = config.barCapSize;
        entity.height = barHeight + barCapHeight;

        const barSpacing: number = config.barSpacing;
        const barSize: number = config.barSize;
        const totalBarSpacing: number = (config.sampleCount - 1) * barSpacing
        entity.width = config.sampleCount * barSize + totalBarSpacing;
    }

    private _setBarcleDimensions(entity: IEntityConfig<IBarcleVisualizerConfig>): void {
        const config: IBarcleVisualizerConfig = entity.entityContentConfig;

        const ringSize: number = 20;
        const diameter: number = (config.multiplier * 255 + config.baseRadius + ringSize) * 2;
        entity.height = diameter;
        entity.width = diameter;
    }

    private _setCircleDimensions(entity: IEntityConfig<ICircleVisualizerConfig>): void {
        const config: ICircleVisualizerConfig = entity.entityContentConfig;

        const diameter: number = (config.multiplier * 255 + config.baseRadius + config.sampleRadius) * 2;
        entity.height = diameter;
        entity.width = diameter;
    }
}
