import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    HostBinding,
    HostListener,
    Input,
    NgZone,
    OnDestroy,
    OnInit,
    Renderer2,
} from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { BarContentService } from 'src/app/entity-content/bar/bar.content.service';
import { BarcleContentService } from 'src/app/entity-content/barcle/barcle.content.service';
import { BaseContentService } from 'src/app/entity-content/base/base.content.service';
import { CircleContentService } from 'src/app/entity-content/circle/circle.content.service';
import { ImageContentService } from 'src/app/entity-content/image/image.content.service';
import { EntityService } from 'src/app/entity-service/entity.service';
import { Entity, EntityContent, EntityTransform, EntityType } from 'src/app/entity-service/entity.types';
import { BaseCanvasComponent } from '../base-canvas.component';
import { Point, ResizeEdge } from './entity-canvas.types';

@Component({
    selector: 'app-entity-canvas',
    templateUrl: './entity-canvas.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
})
export class EntityCanvasComponent extends BaseCanvasComponent implements OnInit, OnDestroy {
    @Input() entities: Entity[] = [];
    @Input() emittedEntities: Entity[] = [];

    @HostBinding('style.cursor') cursor: string = 'auto';

    private _activeEntity?: Entity | null;

    private _isDragging: boolean = false;
    private _isResizing: boolean = false;

    private _stopWindowMouseMoveListener?: () => void;
    private _stopWindowMouseUpListener?: () => void;

    private _stopWindowTouchMoveListener?: () => void;
    private _stopWindowTouchEndListener?: () => void;

    private readonly _RESIZE_EDGE_SIZE: number = 32;
    private _currResizeEdge?: ResizeEdge | null;
    private _prevPoint?: { x: number; y: number };

    private _destroy: Subject<void> = new Subject();

    constructor(
        ngZone: NgZone,
        elementRef: ElementRef<HTMLElement>,
        private _renderer: Renderer2,
        private _entityService: EntityService,
        private _barService: BarContentService,
        private _barcleService: BarcleContentService,
        private _circleService: CircleContentService,
        private _imageService: ImageContentService
    ) {
        super(ngZone, elementRef);
    }

    ngOnInit(): void {
        this._entityService.activeEntity$
            .pipe(takeUntil(this._destroy))
            .subscribe(activeEntity => (this._activeEntity = activeEntity));
    }

    override ngOnDestroy(): void {
        super.ngOnDestroy();

        this._destroy.next();
        this._destroy.complete();
    }

    @HostListener('mousedown', ['$event'])
    onMouseDown(event: MouseEvent): void {
        this._onViewMouseDown(event);
    }

    @HostListener('mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
        this._updateCursor(event);
    }

    @HostListener('touchstart', ['$event'])
    onTouchStart(event: TouchEvent): void {
        this._onViewTouchStart(event);
    }

    @HostListener('touchmove', ['$event'])
    onTouchMove(event: TouchEvent): void {
        this._updateCursor(event.touches.item(0)!);
    }

    protected _animate(): void {
        // TODO move emitted entities into entities
        this._animateEntities(this.emittedEntities);
        this._animateEntities(this.entities);

        if (this._activeEntity) {
            this._drawSelectionBorder(this._activeEntity);
        }
    }

    private _animateEntities(entities: Entity[]): void {
        // Animate entities in reverse order
        for (let i: number = entities.length - 1; i >= 0; i--) {
            const entity: Entity = entities[i];
            // Skip inactive emitter
            if (entity.isEmitter && entity.id !== this._activeEntity?.id) {
                continue;
            }
            this._getContentService(entity.type).animate(entity, this._canvasContext);
        }
    }

    private _getScaledPoint(source: MouseEvent | Touch): Point {
        const x: number = source.clientX / this.viewScale;
        const windowCenter: number = window.innerHeight / 2;
        const centerOffset: number = windowCenter - source.clientY;
        const y: number = windowCenter - centerOffset / this.viewScale;

        return { x, y };
    }

    private _getResizeEdge({ transform, transform: { rotation } }: Entity, point: Point): ResizeEdge | null {
        if (rotation.value !== 0) {
            return null;
        }

        const rightEdgeLeft: number = transform.left + transform.width - this._RESIZE_EDGE_SIZE;
        const rightEdgeTop: number = transform.top;
        const isInTopRightX: boolean = point.x > rightEdgeLeft && point.x <= rightEdgeLeft + this._RESIZE_EDGE_SIZE;
        const isInTopRightY: boolean = point.y > rightEdgeTop && point.y <= rightEdgeTop + transform.height;
        if (isInTopRightX && isInTopRightY) {
            return ResizeEdge.RIGHT;
        }

        const bottomEdgeLeft: number = transform.left;
        const bottomEdgeTop: number = transform.top + transform.height - this._RESIZE_EDGE_SIZE;
        const isInTopLeftX: boolean = point.x > bottomEdgeLeft && point.x <= bottomEdgeLeft + transform.width;
        const isInTopLeftY: boolean = point.y > bottomEdgeTop && point.y <= bottomEdgeTop + this._RESIZE_EDGE_SIZE;
        if (isInTopLeftX && isInTopLeftY) {
            return ResizeEdge.BOTTOM;
        }

        return null;
    }

    private _canMove({ transform }: Entity, point: Point): boolean {
        return (
            point.x > transform.left &&
            point.x <= transform.left + transform.width &&
            point.y > transform.top &&
            point.y <= transform.top + transform.height
        );
    }

    private _dragActiveEntity(point: Point): void {
        if (!this._activeEntity || !this._prevPoint) {
            return;
        }

        const { transform } = this._activeEntity;
        transform.left += point.x - this._prevPoint.x;
        transform.top += point.y - this._prevPoint.y;
    }

    private _resizeActiveEntity(point: Point): void {
        if (!this._activeEntity || !this._prevPoint) {
            return;
        }

        const { transform } = this._activeEntity;
        switch (this._currResizeEdge) {
            case ResizeEdge.BOTTOM:
                // Scale based on height
                const deltaY: number = point.y - this._prevPoint.y;
                const finalDeltaY: number = Math.max(transform.height + deltaY, this._RESIZE_EDGE_SIZE);
                transform.scale = (finalDeltaY * transform.scale) / transform.height;
                this._entityService.setEntityDimensions(this._activeEntity);
                break;
            case ResizeEdge.RIGHT:
                // Scale based on width
                const deltaX: number = point.x - this._prevPoint.x;
                const finalDeltaX: number = Math.max(transform.width + deltaX, this._RESIZE_EDGE_SIZE);
                transform.scale = (finalDeltaX * transform.scale) / transform.width;
                this._entityService.setEntityDimensions(this._activeEntity);
                break;
        }
    }

    private _onViewMouseDown(event: MouseEvent): void {
        const point: Point = this._getScaledPoint(event);

        // Clear the active entity if it isn't the mouse target
        if (!!this._activeEntity && !this._canMove(this._activeEntity, point)) {
            this._entityService.setActiveEntity(null);
        }

        if (!this._activeEntity) {
            return;
        }
        event.stopPropagation();

        this._onInteractionStart(point);
        this._stopWindowMouseMoveListener = this._renderer.listen('window', 'mousemove', event =>
            this._onInteractionMove(this._getScaledPoint(event))
        );
        this._stopWindowMouseUpListener = this._renderer.listen('window', 'mouseup', () => {
            this._onInteractionEnd();
            this._stopWindowMouseMoveListener?.();
            this._stopWindowMouseUpListener?.();
        });
    }

    private _onViewTouchStart(event: TouchEvent): void {
        const firstTouch: Touch | null = event.touches.item(0);
        if (!firstTouch) {
            return;
        }

        const point: Point = this._getScaledPoint(firstTouch);

        // Clear the active entity if it isn't the touch target
        if (!!this._activeEntity && !this._canMove(this._activeEntity, point)) {
            this._entityService.setActiveEntity(null);
        }

        if (!this._activeEntity) {
            return;
        }
        event.stopPropagation();

        this._onInteractionStart(point);
        this._stopWindowTouchMoveListener = this._renderer.listen('window', 'touchmove', event =>
            this._onInteractionMove(this._getScaledPoint(event.touches.item(0)))
        );
        this._stopWindowTouchEndListener = this._renderer.listen('window', 'touchend', () => {
            this._onInteractionEnd();
            this._stopWindowTouchMoveListener?.();
            this._stopWindowTouchEndListener?.();
        });
    }

    private _onInteractionStart(point: Point): void {
        if (!this._activeEntity) {
            return;
        }

        const resizeEdge: ResizeEdge | null = this._getResizeEdge(this._activeEntity, point);
        if (resizeEdge) {
            this._currResizeEdge = resizeEdge;
            this._isResizing = true;
        } else {
            this._isDragging = true;
        }

        this._prevPoint = point;
    }

    private _onInteractionMove(point: Point): void {
        if (this._isResizing) {
            this._resizeActiveEntity(point);
        } else if (this._isDragging) {
            this._dragActiveEntity(point);
        }

        this._prevPoint = point;
    }

    private _onInteractionEnd(): void {
        this._isResizing = false;
        this._isDragging = false;
        this._currResizeEdge = null;
    }

    private _updateCursor(source: MouseEvent | Touch): void {
        if (!this._activeEntity) {
            return;
        }

        const point: Point = this._getScaledPoint(source);
        const showMoveCursor: boolean = this._canMove(this._activeEntity, point);
        const showResizeCursor: boolean = !!this._getResizeEdge(this._activeEntity, point) || this._isResizing;

        this.cursor = showResizeCursor ? 'nwse-resize' : showMoveCursor ? 'move' : 'auto';
    }

    private _drawSelectionBorder({ transform }: Entity): void {
        this._canvasContext.globalAlpha = 1;
        this._canvasContext.shadowBlur = 0;

        this._canvasContext.lineWidth = 4;
        this._canvasContext.strokeStyle = '#383838';
        this._canvasContext.strokeRect(transform.left, transform.top, transform.width, transform.height);
        this._drawResizeBorders(transform);

        this._canvasContext.lineWidth = 2;
        this._canvasContext.strokeStyle = '#177ddc';
        this._canvasContext.strokeRect(transform.left, transform.top, transform.width, transform.height);
        this._drawResizeBorders(transform);
    }

    private _drawResizeBorders(transform: EntityTransform): void {
        const rightEdgeLeft: number = transform.left + transform.width - this._RESIZE_EDGE_SIZE;
        const bottomEdgeTop: number = transform.top + transform.height - this._RESIZE_EDGE_SIZE;

        this._drawLine(rightEdgeLeft, transform.top, rightEdgeLeft, transform.top + transform.height);
        this._drawLine(transform.left, bottomEdgeTop, transform.left + transform.width, bottomEdgeTop);
    }

    private _drawLine(startX: number, startY: number, endX: number, endY: number): void {
        this._canvasContext.beginPath();
        this._canvasContext.moveTo(startX, startY);
        this._canvasContext.lineTo(endX, endY);
        this._canvasContext.stroke();
    }

    private _getContentService(type: EntityType): BaseContentService<EntityContent> {
        switch (type) {
            case EntityType.BAR:
                return this._barService;
            case EntityType.BARCLE:
                return this._barcleService;
            case EntityType.CIRCLE:
                return this._circleService;
            case EntityType.IMAGE:
                return this._imageService;
            default:
                throw new Error('Unknown entity type');
        }
    }
}
