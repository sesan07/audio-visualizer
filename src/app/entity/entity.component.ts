import {
    Component,
    ElementRef,
    HostBinding,
    Input,
    NgZone,
    OnChanges,
    OnDestroy,
    Renderer2,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import { EntityType, IEntityContentConfig } from './entity.types';
import { getRadians, getRandomNumber } from '../shared/utils';
import { DraggableComponent } from '../shared/components/draggable/draggable.component';

@Component({
    selector: 'app-entity',
    templateUrl: './entity.component.html',
    styleUrls: ['./entity.component.scss']
})
export class EntityComponent extends DraggableComponent implements OnChanges, OnDestroy {
    @Input() boundaryElement: HTMLElement;
    @Input() @HostBinding('class.outline') showOutline: boolean;
    @Input() type: EntityType;
    @Input() animationStopTime?: number;
    @Input() animateMovement?: boolean;
    @Input() animateRotation?: boolean;
    @Input() movementAngle?: number;
    @Input() movementSpeed?: number;
    @Input() rotation: number;
    @Input() rotationSpeed?: number;
    @Input() startLeft?: number;
    @Input() startTop?: number;
    @Input() entityContentConfig: IEntityContentConfig;
    
    @ViewChild('entityTypeElement') _entityTypeElementRef: ElementRef<HTMLElement>

    // todo: fall down effect (slowly change angle to 90 degrees)

    // This allows EntityType to be used in the HTML file
    EntityType = EntityType;

    private _animationFrameId: number;
    private _isAnimating: boolean;
    private _movementAngleRadians: number;
    private _rotation: number = 0;

    constructor(renderer: Renderer2, elementRef: ElementRef<HTMLElement>, private _ngZone: NgZone) {
        super(renderer, elementRef);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.movementAngle) {
            this._movementAngleRadians = getRadians(this.movementAngle);
        }
        if ((changes.animateMovement && !changes.animateMovement.firstChange)
            || (changes.animateRotation && !changes.animateRotation.firstChange)) {
            this._updateAnimationState();
        }
        if (changes.rotation && !changes.rotation.firstChange) {
            this._setRotation(this.rotation);
        }
    }

    ngAfterViewInit(): void {
        const clientWidth: number = this._elementRef.nativeElement.clientWidth;
        const clientHeight: number = this._elementRef.nativeElement.clientHeight;
        let left: number;
        let top: number;
        if (this.startLeft && this.startTop) {
            left = this.startLeft - clientWidth / 2;
            top = this.startTop - clientHeight / 2;
        } else {
            left = getRandomNumber(0, this.boundaryElement.clientWidth - clientWidth);
            top = getRandomNumber(0, this.boundaryElement.clientHeight - clientHeight);
        }
        this._setPosition(left, top);
        this._setRotation(this.rotation)
        this._updateAnimationState();
    }

    private _animate(): void {
        this._ngZone.runOutsideAngular(() => {
            if (this.animateMovement) {
                this._animateMovement();
            }
            if (this.animateRotation) {
                this._animateRotation();
            }

            this._animationFrameId = requestAnimationFrame(() => this._animate());
        });
    }

    private _animateMovement(): void {
        const newLeft: number = this._left + this.movementSpeed * Math.cos(this._movementAngleRadians);
        const newTop: number = this._top + this.movementSpeed * Math.sin(this._movementAngleRadians);
        this._setPosition(newLeft, newTop);
    }

    private _animateRotation(): void {
        this._setRotation((this._rotation + this.rotationSpeed) % 360)
    }

    protected _setRotation(rotation: number) {
        this._rotation =  rotation;
        this._renderer.setStyle(this._entityTypeElementRef.nativeElement, 'transform', `rotate(${this._rotation}deg)`)
    }

    private _stopAnimation(stopTime: number): void {
        // Stop animation
        if (this._animationFrameId) {
            if (stopTime > 0) {
                // Stop after some time
                // Useful if the component is still visible for some time after destruction
                setTimeout(() => {
                    cancelAnimationFrame(this._animationFrameId);
                }, stopTime);
            } else {
                // Stop immediately
                cancelAnimationFrame(this._animationFrameId);
            }
        }

        this._isAnimating = false;
    }

    private _updateAnimationState(): void {
        if ((this.animateMovement || this.animateRotation) && !this._isAnimating) {
            this._isAnimating = true;
            this._animate();
        } else if (this._isAnimating) {
            this._isAnimating = false;
            this._stopAnimation(this.animationStopTime)
        }
    }

    ngOnDestroy(): void {
        this._stopAnimation(this.animationStopTime);
    }
}
