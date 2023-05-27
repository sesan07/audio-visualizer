import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    HostListener,
    Input,
    NgZone,
    OnDestroy,
    OnInit,
    Renderer2,
    ViewChild,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Entity, EntityContent, EntityLayer, EntityType } from '../app.types';
import { AppService } from '../app.service';
import { Point, ResizeEdge } from './entity-canvas.types';
import { getRadians } from '../shared/utils';
import { BarContentService } from 'src/app/entity-content/bar/bar.content.service';
import { CircleContentService } from 'src/app/entity-content/circle/circle.content.service';
import { ImageContentService } from 'src/app/entity-content/image/image.content.service';
import { BarcleContentService } from 'src/app/entity-content/barcle/barcle.content.service';
import { BaseContentService } from 'src/app/entity-content/base/base.content.service';

@Component({
    selector: 'app-entity-canvas',
    templateUrl: './entity-canvas.component.html',
    styleUrls: ['./entity-canvas.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
})
export class EntityCanvasComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() layer!: EntityLayer;
    @Input() viewElement!: HTMLElement;
    @Input() viewScale!: number;

    @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;

    @HostListener('window:resize')
    updateViewDimensions(): void {
        console.log('resize');
        this._height = this._elementRef.nativeElement.clientHeight;
        this._width = this._elementRef.nativeElement.clientWidth;
        this.canvasElement.nativeElement.height = this._height;
        this.canvasElement.nativeElement.width = this._width;
    }

    private _activeEntity?: Entity | null;

    private _canvasContext!: CanvasRenderingContext2D;
    private _height!: number;
    private _width!: number;
    private _animationFrameId!: number;

    private _isDragging: boolean = false;
    private _isResizing: boolean = false;

    private _stopViewMouseDownListener?: () => void;
    private _stopViewMouseMoveListener?: () => void;
    private _stopWindowMouseMoveListener?: () => void;
    private _stopWindowMouseUpListener?: () => void;

    private _stopViewTouchStartListener?: () => void;
    private _stopViewTouchMoveListener?: () => void;
    private _stopWindowTouchMoveListener?: () => void;
    private _stopWindowTouchEndListener?: () => void;

    private readonly _resizeEdgeSize: number = 40;
    private _currResizeEdge?: ResizeEdge | null;
    private _prevPoint?: { x: number; y: number };

    private _destroy: Subject<void> = new Subject();

    constructor(
        private _renderer: Renderer2,
        private _ngZone: NgZone,
        private _elementRef: ElementRef<HTMLElement>,
        private _entityService: AppService,
        private _barService: BarContentService,
        private _barcleService: BarcleContentService,
        private _circleService: CircleContentService,
        private _imageService: ImageContentService
    ) {}

    ngOnInit(): void {
        this._stopViewMouseDownListener = this._renderer.listen(this.viewElement, 'mousedown', event =>
            this._onViewMouseDown(event)
        );
        this._stopViewTouchStartListener = this._renderer.listen(this.viewElement, 'touchstart', event =>
            this._onViewTouchStart(event)
        );

        this._stopViewMouseMoveListener = this._renderer.listen(this.viewElement, 'mousemove', event =>
            this._updateCursor(event)
        );
        this._stopViewTouchMoveListener = this._renderer.listen(this.viewElement, 'touchmove', event =>
            this._updateCursor(event.touches.item(0))
        );

        this._entityService.activeEntity$
            .pipe(takeUntil(this._destroy))
            .subscribe(activeEntity => (this._activeEntity = activeEntity));
    }

    ngAfterViewInit(): void {
        this._canvasContext = this.canvasElement.nativeElement.getContext('2d')!;

        this.updateViewDimensions();
        this._ngZone.runOutsideAngular(() => this._animateCanvas());
    }

    ngOnDestroy(): void {
        this._stopViewMouseDownListener?.();
        this._stopViewMouseMoveListener?.();
        this._stopViewTouchStartListener?.();
        this._stopViewTouchMoveListener?.();

        cancelAnimationFrame(this._animationFrameId);

        this._destroy.next();
        this._destroy.complete();
    }

    private _animateCanvas(): void {
        if (!this._canvasContext) {
            return;
        }
        // console.log('3', NgZone.isInAngularZone());
        this._canvasContext.clearRect(0, 0, this._width, this._height);

        this._animateEntities(this.layer.emittedEntities);
        this._animateEntities(this.layer.entities);

        if (this._activeEntity) {
            this._drawSelectionBorder(this._activeEntity);
            if (this._activeEntity.transform.rotation.value === 0) {
                this._drawResizeBorders(this._activeEntity);
            }
        }

        this._animationFrameId = requestAnimationFrame(() => this._animateCanvas());
    }

    private _animateEntities(entities: Entity[]): void {
        // Animate entities in reverse order
        for (let i: number = entities.length - 1; i >= 0; i--) {
            const entity: Entity = entities[i];
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

        const rightEdgeLeft: number = transform.left + transform.width - this._resizeEdgeSize;
        const rightEdgeTop: number = transform.top;
        const isInTopRightX: boolean = point.x > rightEdgeLeft && point.x <= rightEdgeLeft + this._resizeEdgeSize;
        const isInTopRightY: boolean = point.y > rightEdgeTop && point.y <= rightEdgeTop + transform.height;
        if (isInTopRightX && isInTopRightY) {
            return ResizeEdge.RIGHT;
        }

        const bottomEdgeLeft: number = transform.left;
        const bottomEdgeTop: number = transform.top + transform.height - this._resizeEdgeSize;
        const isInTopLeftX: boolean = point.x > bottomEdgeLeft && point.x <= bottomEdgeLeft + transform.width;
        const isInTopLeftY: boolean = point.y > bottomEdgeTop && point.y <= bottomEdgeTop + this._resizeEdgeSize;
        if (isInTopLeftX && isInTopLeftY) {
            return ResizeEdge.BOTTOM;
        }

        return null;
    }

    private _canMove({ transform, transform: { rotation } }: Entity, point: Point): boolean {
        const topLeft: Point = {
            x: transform.left,
            y: transform.top,
        };
        const topRight: Point = {
            x: transform.left + transform.width,
            y: transform.top,
        };
        const bottomLeft: Point = {
            x: transform.left,
            y: transform.top + transform.height,
        };
        const bottomRight: Point = {
            x: transform.left + transform.width,
            y: transform.top + transform.height,
        };

        const origin: Point = {
            x: transform.left + transform.width / 2,
            y: transform.top + transform.height / 2,
        };

        this._rotatePoint(topLeft, origin, rotation.value);
        this._rotatePoint(topRight, origin, rotation.value);
        this._rotatePoint(bottomLeft, origin, rotation.value);
        this._rotatePoint(bottomRight, origin, rotation.value);

        const triangleAreaSum: number =
            this._getTriangleArea(topLeft, bottomRight, point) +
            this._getTriangleArea(topRight, topLeft, point) +
            this._getTriangleArea(bottomLeft, topRight, point) +
            this._getTriangleArea(bottomRight, bottomLeft, point);

        const rectangleArea: number = transform.height * transform.width;
        return rectangleArea > triangleAreaSum;
    }

    // Based on https://stackoverflow.com/a/2259502/12437640
    private _rotatePoint(point: Point, origin: Point, angle: number): void {
        const angleRadians: number = getRadians(angle);
        // Translate point
        point.x -= origin.x;
        point.y -= origin.y;

        // Rotate point
        const newX: number = point.x * Math.cos(angleRadians) - point.y * Math.sin(angleRadians);
        const newY: number = point.x * Math.sin(angleRadians) + point.y * Math.cos(angleRadians);

        // Translate point back
        point.x = newX + origin.x;
        point.y = newY + origin.y;
    }

    // Based on https://stackoverflow.com/a/17146376/12437640
    private _getTriangleArea(p1: Point, p2: Point, p3: Point): number {
        return Math.abs(p1.x * p3.y - p3.x * p1.y + (p2.x * p1.y - p1.x * p2.y) + (p3.x * p2.y - p2.x * p3.y)) / 2;
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
                const finalDeltaY: number = Math.max(transform.height + deltaY, this._resizeEdgeSize);
                transform.scale = (finalDeltaY * transform.scale) / transform.height;
                this._entityService.setEntityDimensions(this._activeEntity);
                break;
            case ResizeEdge.RIGHT:
                // Scale based on width
                const deltaX: number = point.x - this._prevPoint.x;
                const finalDeltaX: number = Math.max(transform.width + deltaX, this._resizeEdgeSize);
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

        // Reverse search array, bottom elements are drawn over others
        this.layer.entities.forEach(entity => {
            if (entity === this._activeEntity) {
                entity.showResizeCursor = !!this._getResizeEdge(entity, point) || this._isResizing;
                entity.showMoveCursor = this._canMove(entity, point);
            } else {
                entity.showMoveCursor = false;
                entity.showResizeCursor = false;
            }
        });
    }

    private _drawSelectionBorder({ transform }: Entity): void {
        this._canvasContext.globalAlpha = 1;
        this._canvasContext.shadowBlur = 0;
        this._canvasContext.strokeStyle = 'yellow';
        this._canvasContext.strokeRect(transform.left, transform.top, transform.width, transform.height);
    }

    private _drawResizeBorders({ transform }: Entity): void {
        const rightEdgeLeft: number = transform.left + transform.width - this._resizeEdgeSize;
        const rightEdgeTop: number = transform.top;

        const bottomEdgeLeft: number = transform.left;
        const bottomEdgeTop: number = transform.top + transform.height - this._resizeEdgeSize;

        this._canvasContext.strokeRect(rightEdgeLeft, rightEdgeTop, this._resizeEdgeSize, transform.height);
        this._canvasContext.strokeRect(bottomEdgeLeft, bottomEdgeTop, transform.width, this._resizeEdgeSize);
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
