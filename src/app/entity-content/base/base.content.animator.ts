import { Entity, EntityContent } from 'src/app/entity-service/entity.types';
import { Oomph } from 'src/app/source-services/audio.source.service.types';
import { getRadians } from 'src/app/utils';

export abstract class BaseContentAnimator<T extends EntityContent> {
    protected _scale: number = 0;
    protected _scaledWidth: number = 0;
    protected _scaledHeight: number = 0;
    protected _scaledLeft: number = 0;
    protected _scaledTop: number = 0;
    protected _centerX: number = 0;
    protected _centerY: number = 0;

    private readonly _OPACITY_CHANGE_TIME: number = 250; // ms

    constructor(protected _amplitudesMap: Record<string, Uint8Array>, protected _oomph: Oomph) {}

    animate(entity: Entity<T>, canvasContext: CanvasRenderingContext2D): void {
        this._animateEntity(entity, canvasContext);
        this._animateContent(entity, canvasContext);
        this._updateOpacity(entity);

        // Reset transformation matrix to the identity matrix
        canvasContext.setTransform(1, 0, 0, 1, 0, 0);
    }

    protected abstract _animateContent(entity: Entity<T>, canvasContext: CanvasRenderingContext2D): void;

    private _animateEntity(entity: Entity, canvasContext: CanvasRenderingContext2D): void {
        this._move(entity);
        this._setEntityProperties(entity);
        this._rotate(entity, canvasContext);
    }

    private _move({ isEmitted, transform, transform: { movement } }: Entity): void {
        if (isEmitted && movement.animate) {
            const movementAngleRadians: number = getRadians(movement.angle);
            transform.left = transform.left + movement.speed * Math.cos(movementAngleRadians);
            transform.top = transform.top + movement.speed * Math.sin(movementAngleRadians);
        }
    }

    private _rotate({ transform: { rotation } }: Entity, canvasContext: CanvasRenderingContext2D): void {
        if (rotation.animate) {
            rotation.value =
                (rotation.value - (rotation.direction === 'Left' ? rotation.speed : -rotation.speed)) % 360;
        }

        canvasContext.translate(this._centerX, this._centerY);
        canvasContext.rotate(getRadians(rotation.value));
        canvasContext.translate(-this._centerX, -this._centerY);
    }

    private _setEntityProperties({ transform }: Entity): void {
        const oomphScale: number = 1 + this._oomph.value * transform.oomphAmount;
        this._scale = transform.scale * oomphScale;
        this._scaledWidth = transform.width * oomphScale;
        this._scaledHeight = transform.height * oomphScale;
        this._scaledLeft = transform.left - (this._scaledWidth - transform.width) / 2;
        this._scaledTop = transform.top - (this._scaledHeight - transform.height) / 2;
        this._centerX = this._scaledLeft + this._scaledWidth / 2;
        this._centerY = this._scaledTop + this._scaledHeight / 2;
    }

    private _updateOpacity({ emitter: { spawnTime, lifespan }, opacity }: Entity): void {
        if (!spawnTime || !lifespan) {
            opacity.current = opacity.target;
            return;
        }

        const deathTime: number = spawnTime + lifespan;
        let nextOpacity: number;
        if (deathTime - Date.now() < this._OPACITY_CHANGE_TIME) {
            nextOpacity = (deathTime - Date.now()) / this._OPACITY_CHANGE_TIME;
        } else {
            nextOpacity = Math.min(Date.now() - spawnTime, this._OPACITY_CHANGE_TIME) / this._OPACITY_CHANGE_TIME;
        }
        const cappedOpacity: number = Math.min(nextOpacity, opacity.target);
        opacity.current = cappedOpacity;
    }
}
