import { Entity, EntityContent } from 'src/app/entity-service/entity.types';
import { getRandomNumber } from 'src/app/utils';
import { BaseContentAnimator } from './base.content.animator';

export abstract class BaseContentService<T extends EntityContent> {
    protected abstract _animator: BaseContentAnimator<T>;

    private _entityView?: HTMLElement;

    animate(entity: Entity<T>, canvasContext: CanvasRenderingContext2D): void {
        this._animator.animate(entity, canvasContext);
    }

    beforeEmit(content: T): void {}

    setAddPreset(entity: Entity<T>): void {
        if (!this._entityView) {
            console.warn('entityView is not ready');
            return;
        }

        const { transform } = entity;
        entity.presetX = (transform.left + transform.width / 2) / this._entityView.clientWidth;
        entity.presetY = (transform.top + transform.height / 2) / this._entityView.clientHeight;
        entity.content = this._getAddPreset(entity.content);
    }

    setLoadPreset(entity: Entity<T>): void {
        const { transform } = entity;
        if (!this._entityView) {
            console.warn('entityView is not ready');
            return;
        }

        transform.left = (entity.presetX ?? 0) * this._entityView.clientWidth - transform.width / 2;
        transform.top = (entity.presetY ?? 0) * this._entityView.clientHeight - transform.height / 2;
        entity.content = this._getLoadPreset(entity.content);
    }

    setEntityPosition({ transform }: Entity<T>, centerX?: number, centerY?: number): void {
        if (!this._entityView) {
            console.warn('entityView is not ready');
            return;
        }

        if (centerX !== undefined && centerY !== undefined) {
            transform.left = centerX - transform.width / 2;
            transform.top = centerY - transform.height / 2;
        } else {
            transform.left = getRandomNumber(0, this._entityView.clientWidth - transform.width);
            transform.top = getRandomNumber(0, this._entityView.clientHeight - transform.height);
        }
    }

    setEntityView(view: HTMLElement): void {
        this._entityView = view;
    }

    abstract setEntityDimensions(entity: Entity<T>): void;

    abstract getDefaultContent(isEmitted: boolean): T;

    protected abstract _getAddPreset(content: T): T;

    protected abstract _getLoadPreset(content: T): T;
}
