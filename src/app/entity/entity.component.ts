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
import { EntityType, IEntityConfig } from './entity.types';
import { getRadians, getRandomNumber } from '../shared/utils';
import { DraggableComponent } from '../shared/components/draggable/draggable.component';
import { IOomph } from '../shared/audio-service/audio.service.types';

@Component({
    selector: 'app-entity',
    templateUrl: './entity.component.html',
    styleUrls: ['./entity.component.scss']
})
export class EntityComponent extends DraggableComponent implements OnChanges, OnDestroy {
    @Input() boundaryElement: HTMLElement;
    @Input() oomph: IOomph;
    @Input() @HostBinding('class.outline') showOutline: boolean;
    @Input() config: IEntityConfig;
    @Input() animateMovement?: boolean;
    @Input() animateRotation?: boolean;
    @Input() animateOomph?: boolean;
    @Input() movementAngle?: number;
    @Input() rotation: number;
    @Input() rotationDirection: 'Left' | 'Right';
    @Input() rotationSpeed?: number;

    @ViewChild('entityTypeElement') _entityTypeElementRef: ElementRef<HTMLElement>

    // todo: fall down effect (slowly change angle to 90 degrees, or user set target angle (start, finish angles))

    // This allows EntityType to be used in the HTML file
    EntityType = EntityType;

    private _animationFrameId: number;
    private _isAnimating: boolean;
    private _movementAngleRadians: number;
    private _rotationSpeed: number;
    private _scale: number = 1;

    constructor(renderer: Renderer2, elementRef: ElementRef<HTMLElement>, private _ngZone: NgZone) {
        super(renderer, elementRef);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.movementAngle) {
            this._movementAngleRadians = getRadians(this.movementAngle);
        }
        if (changes.rotation && !changes.rotation.firstChange) {
            this._setTransform(this._scale);
        }
        if (changes.rotationDirection || changes.rotationSpeed) {
            this._rotationSpeed = this.rotationDirection.toLowerCase() === 'right' ? this.rotationSpeed : -this.rotationSpeed;
        }
        if ((changes.animateMovement && !changes.animateMovement.firstChange)
            || (changes.animateRotation && !changes.animateRotation.firstChange)
            || (changes.animateOomph && !changes.animateOomph.firstChange)) {
            this._updateAnimationState();

            if (!this.animateOomph) {
                this._setTransform(1);
            }
        }
    }

    ngAfterViewInit(): void {
        const clientWidth: number = this._elementRef.nativeElement.clientWidth;
        const clientHeight: number = this._elementRef.nativeElement.clientHeight;
        let left: number;
        let top: number;
        if (this.config.startX && this.config.startY) {
            left = this.config.startX - clientWidth / 2;
            top = this.config.startY - clientHeight / 2;
        } else if (this.config.left && this.config.top) {
            left = this.config.left;
            top = this.config.top;
        } else {
            left = getRandomNumber(0, this.boundaryElement.clientWidth - clientWidth);
            top = getRandomNumber(0, this.boundaryElement.clientHeight - clientHeight);
        }
        this._setPosition(left, top);
        this._setTransform(this._scale)
        setTimeout(() => this._updateAnimationState())
    }

    private _animate(): void {
        this._ngZone.runOutsideAngular(() => {
            if (this.animateMovement) {
                this._animateMovement();
            }
            if (this.animateRotation || this.animateOomph) {
                this._animateTransform();
            }

            this._animationFrameId = requestAnimationFrame(() => this._animate());
        });
    }

    private _animateMovement(): void {
        const newLeft: number = this._left + this.config.movementSpeed * Math.cos(this._movementAngleRadians);
        const newTop: number = this._top + this.config.movementSpeed * Math.sin(this._movementAngleRadians);
        this._setPosition(newLeft, newTop);
    }

    private _animateTransform(): void {
        if (this.animateRotation) {
            this.config.rotation = (this.config.rotation + this._rotationSpeed) % 360;
        }

        let scale: number = this._scale;
        if (this.animateOomph) {
            const oomphScale: number = (this.oomph.value) * this.config.oomphAmount;
            scale = oomphScale + 1;
        }

        this._setTransform(scale)
    }

    protected _setTransform(scale: number) {
        this._scale = scale;
        this._renderer.setStyle(this._entityTypeElementRef.nativeElement, 'transform', `rotate(${this.config.rotation}deg)` + ` scale(${scale})`)
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
        if (this.animateMovement || this.animateRotation || this.animateOomph) {
            if (this._isAnimating) {
                return;
            }
            this._isAnimating = true;
            this._animate();
        } else if (this._isAnimating) {
            this._isAnimating = false;
            this._stopAnimation(this.config.fadeTime * 1000)
        }
    }

    ngOnDestroy(): void {
        this._stopAnimation(this.config.fadeTime * 1000);
    }
}
