import { Entity, EntityContent } from '../../entity/entity.types';
import { getRandomNumber } from '../../shared/utils';

export abstract class BaseContentService<T extends EntityContent> {
    private _entityView: HTMLElement;

    beforeEmit(content: T): void {
    }

    setEntityPosition(entity: Entity<T>, centerX?: number, centerY?: number): void {
        if (centerX !== undefined && centerY !== undefined) {
            entity.left = centerX - entity.width / 2
            entity.top = centerY - entity.height / 2
        } else {
            entity.left = getRandomNumber(0, this._entityView.clientWidth - entity.width);
            entity.top = getRandomNumber(0, this._entityView.clientHeight - entity.height);
        }
    }

    setEntityView(view: HTMLElement): void {
        this._entityView = view;
    }

    abstract setEntityDimensions(entity: Entity<T>): void;

    abstract getDefaultContent(isEmitted: boolean): T;

    abstract getCleanPreset(content: T): T;

    abstract updatePreset(content: T): T;
}
