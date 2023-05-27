import { BaseContentAnimator } from '../base/base.content-animator';
import { Entity } from '../../app.types';
import { ImageContent } from './image.content.types';

export class ImageContentAnimator extends BaseContentAnimator<ImageContent> {
    protected _animateContent(
        { content, opacity }: Entity<ImageContent>,
        canvasContext: CanvasRenderingContext2D
    ): void {
        canvasContext.globalAlpha = opacity.current;
        canvasContext.shadowBlur = 0;
        canvasContext.drawImage(
            content.source.frames![Math.floor(content.currGifIndex)],
            this._scaledLeft,
            this._scaledTop,
            this._scaledWidth,
            this._scaledHeight
        );
        content.currGifIndex = (content.currGifIndex + content.speed) % content.source.frames!.length;
    }
}
