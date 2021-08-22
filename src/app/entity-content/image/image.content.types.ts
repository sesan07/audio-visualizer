import { ISource } from '../../shared/source-services/base.source.service.types';

export interface IImageContentConfig {
    source: ISource;
    element: HTMLImageElement;
}