import { Injectable } from '@angular/core';
import { BaseContentService } from '../base/base.content.service';
import { IEntityConfig } from '../../entity/entity.types';
import { AudioSourceService } from '../../shared/source-services/audio.source.service';
import { ICircleContentConfig } from './circle.content.types';
import { getRandomColor } from '../../shared/utils';

@Injectable({
    providedIn: 'root'
})
export class CircleContentService extends BaseContentService<ICircleContentConfig> {

    constructor(private _audioService: AudioSourceService) {
        super();
    }

    beforeEmit(config: ICircleContentConfig): void {
        if (config.randomizeColors) {
            config.startColor = getRandomColor();
            config.endColor = getRandomColor();
        }
    }

    getCleanPreset(config: ICircleContentConfig): ICircleContentConfig {
        const configClone = Object.assign({}, config);
        delete configClone.amplitudes;
        return configClone;
    }

    getDefaultContent(isEmitted: boolean): ICircleContentConfig {
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
            sampleRadius: 25,
        };
    }

    setEntityDimensions(entity: IEntityConfig<ICircleContentConfig>): void {
        const config: ICircleContentConfig = entity.entityContentConfig;

        const diameter: number = (config.multiplier * 255 + config.baseRadius + config.sampleRadius) * 2;
        entity.height = diameter;
        entity.width = diameter;
    }

    updatePreset(config: ICircleContentConfig): ICircleContentConfig {
        const configClone = Object.assign({}, config);
        configClone.amplitudes = this._audioService.getAmplitudes(configClone.sampleCount);
        return configClone;
    }
}
