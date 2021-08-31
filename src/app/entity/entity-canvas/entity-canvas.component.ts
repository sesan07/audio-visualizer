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
import { EntityType, Entity } from '../entity.types';
import { AudioSourceService } from '../../shared/source-services/audio.source.service';
import { BarContentAnimator } from '../../entity-content/bar/bar.content-animator';
import { BarcleContentAnimator } from '../../entity-content/barcle/barcle.content-animator';
import { CircleContentAnimator } from '../../entity-content/circle/circle.content-animator';
import { ImageContentAnimator } from '../../entity-content/image/image.content-animator';
import { Oomph } from '../../shared/source-services/audio.source.service.types';
import { BarContent } from '../../entity-content/bar/bar.content.types';
import { BarcleContent } from '../../entity-content/barcle/barcle.content.types';
import { CircleContent } from '../../entity-content/circle/circle.content.types';
import { ImageContent } from '../../entity-content/image/image.content.types';

@Component({
    selector: 'app-entity-canvas',
    templateUrl: './entity-canvas.component.html',
    styleUrls: ['./entity-canvas.component.css']
})
export class EntityCanvasComponent implements AfterViewInit {
    @Input() allowInteraction: boolean;
    @Input() entities: Entity[];
    @Input() viewScale: number;
    @Output() entitySelected: EventEmitter<Entity> = new EventEmitter();

    @ViewChild('canvasElement') canvasElement: ElementRef<HTMLCanvasElement>;

    @HostListener('window:resize')
    updateViewDimensions(): void {
        this._height = this._elementRef.nativeElement.clientHeight;
        this._width = this._elementRef.nativeElement.clientWidth;
        this.canvasElement.nativeElement.height = this._height;
        this.canvasElement.nativeElement.width = this._width;
    }

    @HostListener('mousedown', ['$event'])
    onMouseDown(event: MouseEvent): void {
        if (!this.allowInteraction) {
            return;
        }

        this._setSelectedEntity(event);
        if (!this._selectedEntity) {
            return;
        }

        event.stopPropagation();
        const point: { x: number, y: number } = this._getScaledPoint(event);
        this._dragOffsetLeft = this._selectedEntity.left - point.x;
        this._dragOffsetTop = this._selectedEntity.top - point.y;

        this._stopMouseMoveListener = this._renderer.listen('window', 'mousemove', event => this._onDrag(event));
        this._stopMouseUpListener = this._renderer.listen('window', 'mouseup', () => this._onMouseUp());
    }

    @HostListener('touchstart', ['$event'])
    onTouchStart(event: TouchEvent): void {
        if (!this.allowInteraction) {
            return;
        }

        const firstTouch: Touch = event.touches.item(0);
        this._setSelectedEntity(firstTouch);
        if (!this._selectedEntity) {
            return;
        }

        event.stopPropagation();
        const point: { x: number, y: number } = this._getScaledPoint(firstTouch);
        this._dragOffsetLeft = this._selectedEntity.left - point.x;
        this._dragOffsetTop = this._selectedEntity.top - point.y;

        this._stopTouchMoveListener = this._renderer.listen('window', 'touchmove', event => this._onDrag(event.touches.item(0)));
        this._stopTouchEndListener = this._renderer.listen('window', 'touchend', () => this._onTouchEnd());
    }

    private _canvasContext: CanvasRenderingContext2D;
    private _height: number;
    private _width: number;
    private _oomph: Oomph = this._audioService.oomph;

    private _selectedEntity: Entity;
    private _dragOffsetLeft: number;
    private _dragOffsetTop: number;
    private _stopMouseMoveListener: () => void;
    private _stopMouseUpListener: () => void;
    private _stopTouchMoveListener: () => void;
    private _stopTouchEndListener: () => void;

    private _barContent: BarContentAnimator;
    private _barcleContent: BarcleContentAnimator;
    private _circleContent: CircleContentAnimator;
    private _imageContent: ImageContentAnimator;

    private _animationFrameId: number;
    private _deadEntities: Entity[] = [];

    constructor(private _renderer: Renderer2, private _ngZone: NgZone, private _elementRef: ElementRef<HTMLElement>, private _audioService: AudioSourceService) {
    }

    ngAfterViewInit(): void {
        // Microsoft Edge's dimensions at AfterViewInit aren't correct, so wait a bit
        // ElementRef dimensions change after some time (even in an empty app) for some reason..........................
        setTimeout(() => {
            this.updateViewDimensions();
            this._canvasContext = this.canvasElement.nativeElement.getContext('2d');

            this._barContent = new BarContentAnimator(this._canvasContext, this._oomph);
            this._barcleContent = new BarcleContentAnimator(this._canvasContext, this._oomph);
            this._circleContent = new CircleContentAnimator(this._canvasContext, this._oomph);
            this._imageContent = new ImageContentAnimator(this._canvasContext, this._oomph);

            this._animate();
        }, 500);
    }

    private _animate(): void {
        this._ngZone.runOutsideAngular(() => {
            this._canvasContext.clearRect(0, 0, this._width, this._height);

            this.entities.forEach(entity => {
                switch (entity.type) {
                    case EntityType.BAR:
                        this._barContent.animate(entity as Entity<BarContent>);
                        break;
                    case EntityType.BARCLE:
                        this._barcleContent.animate(entity as Entity<BarcleContent>);
                        break;
                    case EntityType.CIRCLE:
                        this._circleContent.animate(entity as Entity<CircleContent>);
                        break;
                    case EntityType.IMAGE:
                        this._imageContent.animate(entity as Entity<ImageContent>);
                        break;
                }

                this._checkDeathStatus(entity);
            });

            this._removeDeadEntities();
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

    private _setSelectedEntity(source: MouseEvent | Touch): void {
        const point: { x: number, y: number } = this._getScaledPoint(source);

        // Reverse search array, bottom elements are drawn over others
        for (let i = this.entities.length - 1; i >= 0; i--) {
            const entity: Entity = this.entities[i];
            const isInBoundsX: boolean = point.x > entity.left && point.x <= entity.left + entity.width;
            const isInBoundsY: boolean = point.y > entity.top && point.y <= entity.top + entity.height;

            if (isInBoundsX && isInBoundsY) {
                this._selectedEntity = entity;
                break;
            }
        }

        if (this._selectedEntity) {
            this.entitySelected.emit(this._selectedEntity)
        }
    }

    private _onDrag(source: MouseEvent | Touch): void {
        const point: { x: number, y: number } = this._getScaledPoint(source);
        this._selectedEntity.left = point.x + this._dragOffsetLeft;
        this._selectedEntity.top = point.y + this._dragOffsetTop;
    }

    private _onMouseUp(): void {
        this._selectedEntity = null;
        this._stopMouseMoveListener();
        this._stopMouseUpListener();
    }

    private _onTouchEnd(): void {
        this._selectedEntity = null;
        this._stopTouchMoveListener();
        this._stopTouchEndListener();
    }

    private _checkDeathStatus(entity: Entity): void {
        entity.isDying = Date.now() >= entity.deathTime;
        if (entity.isDying && entity.currentOpacity <= 0) {
            this._deadEntities.push(entity)
        }
    }

    private _removeDeadEntities(): void {
        this._deadEntities.forEach(entity => {
            const index = this.entities.indexOf(entity);
            this.entities.splice(index, 1);
        })
        this._deadEntities.length = 0;
    }
}
