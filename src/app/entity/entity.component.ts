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
    @Input() oomphAmplitudes: Uint8Array;
    @Input() @HostBinding('class.outline') showOutline: boolean;
    @Input() type: EntityType;
    @Input() animateMovement?: boolean;
    @Input() animateRotation?: boolean;
    @Input() animateOomph?: boolean;
    @Input() movementAngle?: number;
    @Input() movementSpeed?: number;
    @Input() rotation: number;
    @Input() rotationDirection: 'Left' | 'Right';
    @Input() rotationSpeed?: number;
    @Input() oomphAmount?: number;
    @Input() startLeft?: number;
    @Input() startTop?: number;
    @Input() fadeTime?: number;
    @Input() entityContentConfig: IEntityContentConfig;
    
    @ViewChild('entityTypeElement') _entityTypeElementRef: ElementRef<HTMLElement>

    // todo: fall down effect (slowly change angle to 90 degrees)

    // This allows EntityType to be used in the HTML file
    EntityType = EntityType;

    private _animationFrameId: number;
    private _isAnimating: boolean;
    private _movementAngleRadians: number;
    private _rotation: number = 0;
    private _rotationSpeed: number;
    private _scale: number = 1;
    private _maxAmplitudeTotal: number;

    constructor(renderer: Renderer2, elementRef: ElementRef<HTMLElement>, private _ngZone: NgZone) {
        super(renderer, elementRef);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.movementAngle) {
            this._movementAngleRadians = getRadians(this.movementAngle);
        }
        if (changes.oomphAmplitudes) {
            this._maxAmplitudeTotal = 255 * this.oomphAmplitudes.length;
        }
        if (changes.rotationDirection || changes.rotationSpeed) {
            this._rotationSpeed = this.rotationDirection.toLowerCase() === 'right' ? this.rotationSpeed : -this.rotationSpeed;
        }
        if ((changes.animateMovement && !changes.animateMovement.firstChange)
            || (changes.animateRotation && !changes.animateRotation.firstChange)
            || (changes.animateOomph && !changes.animateOomph.firstChange)) {
            this._updateAnimationState();

            if (!this.animateOomph) {
                this._setTransform(this._rotation, 1);
            }
        }
        if (changes.rotation && !changes.rotation.firstChange) {
            this._setTransform(this.rotation, this._scale);
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
        this._setTransform(this._rotation, this._scale)
        this._updateAnimationState();
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
        const newLeft: number = this._left + this.movementSpeed * Math.cos(this._movementAngleRadians);
        const newTop: number = this._top + this.movementSpeed * Math.sin(this._movementAngleRadians);
        this._setPosition(newLeft, newTop);
    }

    private _animateTransform(): void {
        let rotation: number = this._rotation;
        if (this.animateRotation) {
            rotation = (this._rotation + this._rotationSpeed) % 360;
        }

        let scale: number = this._scale;
        if (this.animateOomph) {
            const amplitudeTotal: number = this.oomphAmplitudes.reduce((prev, curr) => prev + curr)
            const oomphScale: number = (amplitudeTotal / this._maxAmplitudeTotal) * this.oomphAmount;
            scale = oomphScale + (1 - this.oomphAmount);
        }

        this._setTransform(rotation, scale)
    }

    protected _setTransform(rotation: number, scale: number) {
        this._rotation = rotation;
        this._scale = scale;
        this._renderer.setStyle(this._entityTypeElementRef.nativeElement, 'transform', `rotate(${this._rotation}deg)` + ` scale(${scale})`)
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
            this._stopAnimation(this.fadeTime * 1000)
        }
    }

    ngOnDestroy(): void {
        this._stopAnimation(this.fadeTime * 1000);
    }
}
