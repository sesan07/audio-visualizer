import { Injectable } from '@angular/core';
import { BaseContentService } from '../base/base.content.service';
import { Entity } from '../../app.types';
import { AudioSourceService } from '../../shared/source-services/audio.source.service';
import { CircleContent } from './circle.content.types';
import { getRandomColor } from '../../shared/utils';
import { CircleContentAnimator } from './circle.content-animator';

@Injectable({
    providedIn: 'root',
})
export class CircleContentService extends BaseContentService<CircleContent> {
    protected _animator: CircleContentAnimator;

    constructor(private _audioService: AudioSourceService) {
        super();
        this._animator = new CircleContentAnimator(_audioService.amplitudesMap, _audioService.oomph);
    }

    override beforeEmit(content: CircleContent): void {
        super.beforeEmit(content);
        if (content.randomStartColor) {
            content.startColor = getRandomColor();
        }
        if (content.randomEndColor) {
            content.endColor = getRandomColor();
        }
    }

    getDefaultContent(isEmitted: boolean): CircleContent {
        return {
            isEmitted: isEmitted,
            startColor: getRandomColor(),
            endColor: getRandomColor(),
            multiplier: 1,
            shadowBlur: 0,
            sampleCount: this._audioService.sampleCounts[0],
            baseRadius: 80,
            sampleRadius: 25,
        };
    }

    setEntityDimensions({ content, transform }: Entity<CircleContent>): void {
        const radius: number = content.multiplier * 255 + content.baseRadius + content.sampleRadius;
        const diameter: number = radius * 2 * transform.scale;
        transform.height = diameter;
        transform.width = diameter;
    }

    protected _getAddPreset(content: CircleContent): CircleContent {
        const contentClone: CircleContent = { ...content };
        return contentClone;
    }

    protected _getLoadPreset(content: CircleContent): CircleContent {
        const contentClone: CircleContent = { ...content };
        return contentClone;
    }
}
