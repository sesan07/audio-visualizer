import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';

import { EntityService } from 'src/app/entity-service/entity.service';
import { Entity } from 'src/app/entity-service/entity.types';
import { EntityNamePipe } from 'src/app/shared-components/entity-name/entity-name.pipe';

@Component({
    selector: 'app-entity-item',
    standalone: true,
    imports: [AsyncPipe, EntityNamePipe, NzButtonModule, NzIconModule, NzDropDownModule],
    templateUrl: './entity-item.component.html',
    styleUrls: ['./entity-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntityItemComponent {
    @Input() entity!: Entity;

    constructor(public entityService: EntityService) {}
}
