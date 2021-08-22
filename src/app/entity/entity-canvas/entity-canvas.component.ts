import { Component, ElementRef, HostListener, Input, NgZone, ViewChild } from '@angular/core';
import { EntityType, IEntityConfig } from '../entity.types';
import { AudioSourceService } from '../../shared/source-services/audio.source.service';
import { BarContent } from '../../entity-content/bar/bar.content';
import { BarcleContent } from '../../entity-content/barcle/barcle.content';
import { CircleContent } from '../../entity-content/circle/circle.content';
import { IOomph } from '../../shared/source-services/audio.source.service.types';
import { ImageContent } from '../../entity-content/image/image.content';
import { IBarContentConfig } from '../../entity-content/bar/bar.content.types';
import { IBarcleContentConfig } from '../../entity-content/barcle/barcle.content.types';
import { ICircleContentConfig } from '../../entity-content/circle/circle.content.types';
import { IImageContentConfig } from '../../entity-content/image/image.content.types';

@Component({
    selector: 'app-entity-canvas',
    templateUrl: './entity-canvas.component.html',
    styleUrls: ['./entity-canvas.component.css']
})
export class EntityCanvasComponent {
    @Input() configs: IEntityConfig[];

    @ViewChild('canvasElement') canvasElement: ElementRef<HTMLCanvasElement>;

    @HostListener('window:resize')
    updateViewDimensions(): void {
        this._height = this._element.clientHeight;
        this._width = this._element.clientWidth;
        this.canvasElement.nativeElement.height = this._height;
        this.canvasElement.nativeElement.width = this._width;
    }

    protected _canvasContext: CanvasRenderingContext2D;
    protected _height: number;
    protected _width: number;
    protected _oomph: IOomph = this._audioService.oomph;

    private _element: HTMLElement;
    private _animationFrameId: number;

    private barVisualizer: BarContent;
    private barcleVisualizer: BarcleContent;
    private circleVisualizer: CircleContent;
    private imageVisualizer: ImageContent;

    constructor(private _ngZone: NgZone, private _elementRef: ElementRef<HTMLElement>, private _audioService: AudioSourceService) {
        this._element = _elementRef.nativeElement;
    }

    ngAfterViewInit(): void {
        // Microsoft Edge's dimensions at AfterViewInit aren't correct, so wait a bit
        // ElementRef dimensions change after some time (even in an empty app) for some reason..........................
        setTimeout(() => {
            this.updateViewDimensions();
            this._canvasContext = this.canvasElement.nativeElement.getContext('2d');

            this.barVisualizer = new BarContent(this._canvasContext, this._oomph);
            this.barcleVisualizer = new BarcleContent(this._canvasContext, this._oomph);
            this.circleVisualizer = new CircleContent(this._canvasContext, this._oomph);
            this.imageVisualizer = new ImageContent(this._canvasContext, this._oomph);

            this._animate();
        }, 500);
    }

    private _animate(): void {
        this._ngZone.runOutsideAngular(() => {
            this._canvasContext.clearRect(0, 0, this._width, this._height);

            this.configs.forEach(entity => {
                switch (entity.type) {
                    case EntityType.BAR:
                        this.barVisualizer._animate(entity as IEntityConfig<IBarContentConfig>);
                        break;
                    case EntityType.BARCLE:
                        this.barcleVisualizer._animate(entity as IEntityConfig<IBarcleContentConfig>);
                        break;
                    case EntityType.CIRCLE:
                        this.circleVisualizer._animate(entity as IEntityConfig<ICircleContentConfig>);
                        break;
                    case EntityType.IMAGE:
                        this.imageVisualizer._animate(entity as IEntityConfig<IImageContentConfig>);
                        break;
                }

                // TODO use this to highlight entity
                // this._canvasContext.strokeStyle = 'yellow';
                // const height: number = entity.height * entity.scale;
                // const width: number = entity.width * entity.scale;
                // const left: number = entity.left - (width - entity.width) / 2;
                // const top: number = entity.top - (height - entity.height) / 2;
                // this._canvasContext.strokeRect(left, top, width, height);

                // Reset transformation matrix to the identity matrix
                this._canvasContext.setTransform(1, 0, 0, 1, 0, 0);
            });

            this._animationFrameId = requestAnimationFrame(() => this._animate());
        });
    }
}
