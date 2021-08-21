import { Injectable, NgZone } from '@angular/core';
import { IEntityConfig, IEntityContentConfig, IEntityContentService } from '../entity.types';
import { IImageConfig } from './image-entity.types';
import { SourceService } from '../../shared/source-service/source.service';
import { ISource } from '../../shared/source-service/source.service.types';
import { DomSanitizer } from '@angular/platform-browser';
import { NzMessageService } from 'ng-zorro-antd/message';
import { getRandomNumber } from '../../shared/utils';

@Injectable({
    providedIn: 'root'
})
export class ImageService extends SourceService implements IEntityContentService {

    entityView: HTMLElement;

    defaultSource: ISource = { name: 'Mako', src: 'assets/image/mako.png' };
    sources: ISource[] = [
        this.defaultSource,
        { name: 'Rain Drop', src: 'assets/image/rain-drop.png' }
    ];

    protected _idPrefix = 'img';

    private _imageElements: HTMLImageElement[];

    constructor(sanitizer: DomSanitizer, messageService: NzMessageService) {
        super(sanitizer, messageService);
        this.sources.forEach(source => source.id = `${this._idPrefix}-${this._currIdIndex++}`);
    }

    beforeEmit(config: IImageConfig): void {
    }

    getDefaultContent(): IImageConfig {
        return {
            name: this.sources[0].name,
            element: this._imageElements.find(element => element.id === this.sources[0].id)
        };
    }

    getSourceElement(source: ISource): HTMLImageElement {
        return  this._imageElements.find(element => element.id === source.id)
    }

    getCleanPreset(config: IImageConfig): IImageConfig {
        return Object.assign({}, config);
    }

    updatePreset(config: IImageConfig): IImageConfig {
        return Object.assign({}, config);
    }

    setEntityDimensions(entity: IEntityConfig<IImageConfig>): void {
        entity.height = 200;

        const config: IImageConfig = entity.entityContentConfig;
        const heightRatio: number = entity.height / config.element.height;
        entity.width = config.element.width * heightRatio;
    }

    setEntityPosition(entity: IEntityConfig<IImageConfig>): void {
        entity.left = getRandomNumber(0, this.entityView.clientWidth - entity.width)
        entity.top = getRandomNumber(0, this.entityView.clientHeight - entity.height)
    }

    setImageElements(imageElements: HTMLImageElement[]): void {
        this._imageElements = imageElements;
        console.log(imageElements[0])
    }
}
