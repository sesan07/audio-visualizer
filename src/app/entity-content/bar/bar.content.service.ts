import { Injectable } from '@angular/core';
import { BaseContentService } from '../base/base.content.service';
import { IBarContentConfig } from './bar.content.types';
import { IEntityConfig } from '../../entity/entity.types';
import { AudioSourceService } from '../../shared/source-services/audio.source.service';
import { getRandomColor } from '../../shared/utils';

@Injectable({
    providedIn: 'root'
})
export class BarContentService extends BaseContentService<IBarContentConfig> {

    constructor(private _audioService: AudioSourceService) {
        super();
    }

    beforeEmit(config: IBarContentConfig): void {
        if (config.randomizeColors) {
            config.startColor = getRandomColor();
            config.endColor = getRandomColor();
        }
    }

    getCleanPreset(config: IBarContentConfig): IBarContentConfig {
        const configClone = Object.assign({}, config);
        delete configClone.amplitudes;
        return configClone;
    }

    getDefaultContent(isEmitted: boolean): IBarContentConfig {
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
            barCapSize: 5,
            barSize: 20,
            barSpacing: 10,
        };
    }

    setEntityDimensions(entity: IEntityConfig<IBarContentConfig>): void {
        const config: IBarContentConfig = entity.entityContentConfig;

        const barHeight: number = config.multiplier * 255;
        const barCapHeight: number = config.barCapSize;
        entity.height = barHeight + barCapHeight;

        const barSpacing: number = config.barSpacing;
        const barSize: number = config.barSize;
        const totalBarSpacing: number = (config.sampleCount - 1) * barSpacing
        entity.width = config.sampleCount * barSize + totalBarSpacing;
    }

    updatePreset(config: IBarContentConfig): IBarContentConfig {
        const configClone = Object.assign({}, config);
        configClone.amplitudes = this._audioService.getAmplitudes(configClone.sampleCount);
        return configClone;
    }
}
