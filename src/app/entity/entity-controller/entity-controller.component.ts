import { Component, Input } from '@angular/core';
import { EntityType, Entity, EntityContent } from '../entity.types';
import { EntityService } from '../entity.service';
import { BarContent } from '../../entity-content/bar/bar.content.types';
import { BarcleContent } from '../../entity-content/barcle/barcle.content.types';
import { CircleContent } from '../../entity-content/circle/circle.content.types';
import { ImageContent } from '../../entity-content/image/image.content.types';

@Component({
    selector: 'app-entity-controller',
    templateUrl: './entity-controller.component.html',
    styleUrls: [ './entity-controller.component.css' ],
})
export class EntityControllerComponent {
    @Input() entity: Entity;

    EntityType: typeof EntityType = EntityType;
    entityTypeOptions: EntityType[] = Object.values(EntityType);
    nameEditPopOverVisible: boolean;

    get entityAsBar(): Entity<BarContent> {
        return this.entity as Entity<BarContent>;
    }

    get entityAsBarcle(): Entity<BarcleContent> {
        return this.entity as Entity<BarcleContent>;
    }

    get entityAsCircle(): Entity<CircleContent> {
        return this.entity as Entity<CircleContent>;
    }
    
    get entityAsImage(): Entity<ImageContent
    > {
        return this.entity as Entity<ImageContent>;
    }

    constructor(private _entityService: EntityService) {
    }

    onEntityTypeChange(newType: EntityType): void {
        this.entity.type = newType;

        const entityContent: EntityContent = this._entityService.getDefaultEntityContent(newType, this.entity.isEmitted);
        Object.assign(this.entity.entityContent, entityContent);
        this._entityService.setEntityDimensions(this.entity);
    }

    onDimensionsChange(): void {
        this._entityService.setEntityDimensions(this.entity);
    }
}
