import { Component, Input } from '@angular/core';
import { IEntityConfig } from '../entity/entity.types';

@Component({
    selector: 'app-entity-controller',
    templateUrl: './entity-controller.component.html',
    styleUrls: ['./entity-controller.component.css'],
})
export class EntityControllerComponent {
    // Todo this controller should be used to change entity type
    @Input() config: IEntityConfig;
}
