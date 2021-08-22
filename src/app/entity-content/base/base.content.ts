import { IEntityConfig, IEntityContentConfig } from '../../entity/entity.types';
import { getRadians } from '../../shared/utils';
import { IOomph } from '../../shared/source-services/audio.source.service.types';

export abstract class BaseContent<T extends IEntityContentConfig> {
    constructor(protected _canvasContext: CanvasRenderingContext2D, protected _oomph: IOomph) {
        this._canvasContext.globalAlpha = 1;
        // this._canvasContext.shadowBlur = 10;
        // this._canvasContext.shadowColor = 'blue';
    }
    // TODO add opacity to all entity-entity-content/images

    public abstract _animate(entity: IEntityConfig<T>): void;

    protected _setMovement(entity: IEntityConfig<T>): void {
        if (entity.animateMovement) {
            const movementAngleRadians = getRadians(entity.movementAngle);
            entity.left = entity.left + entity.movementSpeed * Math.cos(movementAngleRadians);
            entity.top = entity.top + entity.movementSpeed * Math.sin(movementAngleRadians);
        }
    }

    protected _getScale(entity: IEntityConfig): number {
        const oomphScale: number = this._oomph.value * entity.oomphAmount;
        return  entity.scale + oomphScale;
    }

    protected _setRotation(entity: IEntityConfig<T>): void {
        if (entity.animateRotation && entity.rotationDirection === 'Right') {
            entity.rotation = (entity.rotation + entity.rotationSpeed) % 360;
        } else if (entity.animateRotation && entity.rotationDirection === 'Left') {
            entity.rotation = (entity.rotation - entity.rotationSpeed) % 360;
        }
    }
}
