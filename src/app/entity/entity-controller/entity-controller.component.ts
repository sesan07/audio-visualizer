import { Component, Input } from '@angular/core';
import { EntityType, IEntityConfig, IEntityContentConfig } from '../entity.types';
import { EntityService } from '../entity.service';

@Component({
    selector: 'app-entity-controller',
    templateUrl: './entity-controller.component.html',
    styleUrls: ['./entity-controller.component.css'],
})
export class EntityControllerComponent {
    @Input() config: IEntityConfig;

    EntityType = EntityType;
    entityTypeOptions: EntityType[] = Object.values(EntityType);
    nameEditPopOverVisible: boolean;

    constructor(private _entityService: EntityService) {
    }

    onEntityTypeChange(newType: EntityType): void {
        this.config.type = newType;

        const entityContent: IEntityContentConfig = this._entityService.getDefaultEntityContent(newType, this.config.isEmitted);
        Object.assign(this.config.entityContentConfig, entityContent)
        this._entityService.setEntityDimensions(this.config)
    }

    onDimensionsChange(): void {
        this._entityService.setEntityDimensions(this.config);
    }
}
