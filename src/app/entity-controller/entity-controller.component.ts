import { Component, Input } from '@angular/core';
import { EntityType, IEntityConfig } from '../entity/entity.types';
import { EntityService } from '../entity/entity.service';
import { EntityEmitterService } from '../entity-emitter/entity-emitter.service';

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

    constructor(private _entityService: EntityService,
                private _entityEmitterService: EntityEmitterService,) {
    }

    onEntityTypeChange(): void {
        if (this.config.isEmitted) {
            Object.assign(this.config, this._entityEmitterService.getDefaultEmitterEntity(this.config.type))
        } else {
            Object.assign(this.config, this._entityService.getDefaultEntity(this.config.type))
        }
    }
}
