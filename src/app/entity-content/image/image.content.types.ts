import { Source } from 'src/app/source-services/base.source.service.types';

export interface ImageContent {
    source: Source;
    currGifIndex: number;
    speed: number;
}
