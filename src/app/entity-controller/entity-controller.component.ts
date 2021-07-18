import { Component, Input } from '@angular/core';
import { EntityType, IEntityConfig } from '../entity/entity.types';
import { EntityService } from '../entity/entity.service';

@Component({
    selector: 'app-entity-controller',
    templateUrl: './entity-controller.component.html',
    styleUrls: ['./entity-controller.component.css'],
})
export class EntityControllerComponent {
    // Todo this controller should be used to change entity type
    @Input() config: IEntityConfig;

    EntityType = EntityType;
    entityTypeOptions: EntityType[] = Object.values(EntityType);

    constructor(private _entityService: EntityService) {
    }

    onEntityTypeChange(): void {
        Object.assign(this.config, this._entityService.getDefaultEntity(this.config.type))
    }
}
