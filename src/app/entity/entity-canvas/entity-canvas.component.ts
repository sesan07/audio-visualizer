import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    NgZone,
    Output,
    Renderer2,
    ViewChild
} from '@angular/core';
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
export class EntityCanvasComponent implements AfterViewInit {
    @Input() allowInteraction: boolean;
    @Input() configs: IEntityConfig[];
    @Input() viewScale: number;

    @ViewChild('canvasElement') canvasElement: ElementRef<HTMLCanvasElement>;

    @HostListener('window:resize')
    updateViewDimensions(): void {
        this._height = this._elementRef.nativeElement.clientHeight;
        this._width = this._elementRef.nativeElement.clientWidth;
        this.canvasElement.nativeElement.height = this._height;
        this.canvasElement.nativeElement.width = this._width;
    }

    @HostListener('mousedown', ['$event'])
    onMouseDown(event: MouseEvent) {
        if (!this.allowInteraction) {
            return;
        }

        this._selectedConfig = this._getSelectedConfig(event);
        if (!this._selectedConfig) {
            return;
        }

        const point: { x: number, y: number } = this._getScaledPoint(event);
        this._dragOffsetLeft = this._selectedConfig.left - point.x;
        this._dragOffsetTop = this._selectedConfig.top - point.y;

        this._stopMouseMoveListener = this._renderer.listen('window', 'mousemove', event => this._onDrag(event));
        this._stopMouseUpListener = this._renderer.listen('window', 'mouseup', () => this._onMouseUp());
    }

    @HostListener('touchstart', ['$event'])
    onTouchStart(event: TouchEvent) {
        if (!this.allowInteraction) {
            return;
        }

        const firstTouch: Touch = event.touches.item(0);
        this._selectedConfig = this._getSelectedConfig(firstTouch);
        if (!this._selectedConfig) {
            return;
        }

        const point: { x: number, y: number } = this._getScaledPoint(firstTouch);
        this._dragOffsetLeft = this._selectedConfig.left - point.x;
        this._dragOffsetTop = this._selectedConfig.top - point.y;

        this._stopTouchMoveListener = this._renderer.listen('window', 'touchmove', event => this._onDrag(event.touches.item(0)));
        this._stopTouchEndListener = this._renderer.listen('window', 'touchend', () => this._onTouchEnd());
    }

    private _canvasContext: CanvasRenderingContext2D;
    private _height: number;
    private _width: number;
    private _oomph: IOomph = this._audioService.oomph;

    private _selectedConfig: IEntityConfig;
    private _dragOffsetLeft: number;
    private _dragOffsetTop: number;
    private _stopMouseMoveListener: () => void;
    private _stopMouseUpListener: () => void;
    private _stopTouchMoveListener: () => void;
    private _stopTouchEndListener: () => void;

    private barContent: BarContent;
    private barcleContent: BarcleContent;
    private circleContent: CircleContent;
    private imageContent: ImageContent;

    private _animationFrameId: number;

    constructor(private _renderer: Renderer2, private _ngZone: NgZone, private _elementRef: ElementRef<HTMLElement>, private _audioService: AudioSourceService) {
    }

    ngAfterViewInit(): void {
        // Microsoft Edge's dimensions at AfterViewInit aren't correct, so wait a bit
        // ElementRef dimensions change after some time (even in an empty app) for some reason..........................
        setTimeout(() => {
            this.updateViewDimensions();
            this._canvasContext = this.canvasElement.nativeElement.getContext('2d');

            this.barContent = new BarContent(this._canvasContext, this._oomph);
            this.barcleContent = new BarcleContent(this._canvasContext, this._oomph);
            this.circleContent = new CircleContent(this._canvasContext, this._oomph);
            this.imageContent = new ImageContent(this._canvasContext, this._oomph);

            this._animate();
        }, 500);
    }

    private _animate(): void {
        this._ngZone.runOutsideAngular(() => {
            this._canvasContext.clearRect(0, 0, this._width, this._height);

            this.configs.forEach(entity => {
                switch (entity.type) {
                    case EntityType.BAR:
                        this.barContent.animate(entity as IEntityConfig<IBarContentConfig>);
                        break;
                    case EntityType.BARCLE:
                        this.barcleContent.animate(entity as IEntityConfig<IBarcleContentConfig>);
                        break;
                    case EntityType.CIRCLE:
                        this.circleContent.animate(entity as IEntityConfig<ICircleContentConfig>);
                        break;
                    case EntityType.IMAGE:
                        this.imageContent.animate(entity as IEntityConfig<IImageContentConfig>);
                        break;
                }
            });

            this._animationFrameId = requestAnimationFrame(() => this._animate());
        });
    }

    private _getScaledPoint(source: MouseEvent | Touch): { x: number, y: number } {
        const x: number = source.clientX / this.viewScale;
        const windowCenter: number = window.innerHeight / 2;
        const centerOffset: number = windowCenter - source.clientY;
        const y: number = windowCenter - (centerOffset / this.viewScale);

        return { x, y }
    }

    private _getSelectedConfig(source: MouseEvent | Touch): IEntityConfig {
        const point: { x: number, y: number } = this._getScaledPoint(source);

        let selectedConfig: IEntityConfig;
        this.configs.forEach(config => {
            const isInBoundsX: boolean = point.x > config.left && point.x <= config.left + config.width;
            const isInBoundsY: boolean = point.y > config.top && point.y <= config.top + config.height;

            if (isInBoundsX && isInBoundsY && !selectedConfig) {
                selectedConfig = config;
                selectedConfig.isSelected = true
            } else {
                config.isSelected = false;
            }
        })

        return selectedConfig;
    }

    private _onDrag(source: MouseEvent | Touch) {
        const point: { x: number, y: number } = this._getScaledPoint(source);
        this._selectedConfig.left = point.x + this._dragOffsetLeft;
        this._selectedConfig.top = point.y + this._dragOffsetTop;
    }

    private _onMouseUp() {
        this._selectedConfig = null;
        this._stopMouseMoveListener();
        this._stopMouseUpListener();
    }

    private _onTouchEnd() {
        this._selectedConfig = null;
        this._stopTouchMoveListener();
        this._stopTouchEndListener();
    }
}
