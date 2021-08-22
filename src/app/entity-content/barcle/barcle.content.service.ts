import { Injectable } from '@angular/core';
import { BaseContentService } from '../base/base.content.service';
import { IEntityConfig } from '../../entity/entity.types';
import { AudioSourceService } from '../../shared/source-services/audio.source.service';
import { IBarcleContentConfig } from './barcle.content.types';
import { getRandomColor } from '../../shared/utils';

@Injectable({
    providedIn: 'root'
})
export class BarcleContentService extends BaseContentService<IBarcleContentConfig> {

    constructor(private _audioService: AudioSourceService) {
        super();
    }

    beforeEmit(config: IBarcleContentConfig): void {
        if (config.randomizeColors) {
            config.startColor = getRandomColor();
            config.endColor = getRandomColor();
        }
    }

    getCleanPreset(config: IBarcleContentConfig): IBarcleContentConfig {
        const configClone = Object.assign({}, config);
        delete configClone.amplitudes;
        return configClone;
    }

    getDefaultContent(isEmitted: boolean): IBarcleContentConfig {
        const sampleCount: number = this._audioService.sampleCounts[0];
        return {
            isEmitted: isEmitted,
            randomizeColors: isEmitted,
            amplitudes: this._audioService.getAmplitudes(sampleCount),
            startColor: getRandomColor(),
            endColor: getRandomColor(),
            multiplier: 1,
            shadowBlur: isEmitted ? 0 : 5,
            sampleCount: sampleCount,
            baseRadius: 80,
            ringSize: 20,
            fillCenter: false,
        };
    }

    setEntityDimensions(entity: IEntityConfig<IBarcleContentConfig>): void {
        const config: IBarcleContentConfig = entity.entityContentConfig;

        const diameter: number = (config.multiplier * 255 + config.baseRadius + config.ringSize) * 2;
        entity.height = diameter;
        entity.width = diameter;
    }

    updatePreset(config: IBarcleContentConfig): IBarcleContentConfig {
        const configClone = Object.assign({}, config);
        configClone.amplitudes = this._audioService.getAmplitudes(configClone.sampleCount);
        return configClone;
    }
}
