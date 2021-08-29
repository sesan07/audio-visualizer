import { IEntityConfig, IEntityContentConfig } from '../../entity/entity.types';
import { getRadians } from '../../shared/utils';
import { IOomph } from '../../shared/source-services/audio.source.service.types';

export abstract class BaseContent<T extends IEntityContentConfig> {
    protected _scale: number;
    protected _scaledWidth: number;
    protected _scaledHeight: number;
    protected _scaledLeft: number;
    protected _scaledTop: number;
    protected _centerX: number;
    protected _centerY: number;

    constructor(protected _canvasContext: CanvasRenderingContext2D, protected _oomph: IOomph) {
    }

    public animate(entity: IEntityConfig<T>): void {
        this._animateEntity(entity);
        this._animateContent(entity);
    }

    protected abstract _animateContent(entity: IEntityConfig<T>): void;

    private _animateEntity(entity: IEntityConfig<T>): void {
        this._move(entity);
        this._updateEntityProperties(entity);
        this._rotate(entity);
    }

    private _move(entity: IEntityConfig<T>): void {
        if (entity.animateMovement) {
            const movementAngleRadians = getRadians(entity.movementAngle);
            entity.left = entity.left + entity.movementSpeed * Math.cos(movementAngleRadians);
            entity.top = entity.top + entity.movementSpeed * Math.sin(movementAngleRadians);
        }
    }

    private _rotate(entity: IEntityConfig<T>): void {
        if (entity.animateRotation && entity.rotationDirection === 'Right') {
            entity.rotation = (entity.rotation + entity.rotationSpeed) % 360;
        } else if (entity.animateRotation && entity.rotationDirection === 'Left') {
            entity.rotation = (entity.rotation - entity.rotationSpeed) % 360;
        }

        this._canvasContext.translate(this._centerX, this._centerY)
        this._canvasContext.rotate(getRadians(entity.rotation))
        this._canvasContext.translate(-this._centerX, -this._centerY)
    }

    private _updateEntityProperties(entity: IEntityConfig<T>): void {
        const oomphScale: number = 1 + (this._oomph.value * entity.oomphAmount);
        this._scale = entity.scale * oomphScale
        this._scaledWidth = entity.width * oomphScale
        this._scaledHeight = entity.height * oomphScale
        this._scaledLeft = entity.left - (this._scaledWidth - entity.width) / 2;
        this._scaledTop = entity.top - (this._scaledHeight - entity.height) / 2;
        this._centerX = (this._scaledLeft) + (this._scaledWidth / 2);
        this._centerY = (this._scaledTop) + (this._scaledHeight / 2);
    }
}
