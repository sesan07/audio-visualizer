import { NgForOf, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSwitchModule } from 'ng-zorro-antd/switch';

import { EntityService } from 'src/app/entity-service/entity.service';
import { Entity, EntityType } from 'src/app/entity-service/entity.types';
import { ControlLineSliderComponent } from 'src/app/shared-components/control-line-slider/control-line-slider.component';
import { ControlLineComponent } from 'src/app/shared-components/control-line/control-line.component';
import { RandomSwitchComponent } from 'src/app/shared-components/random-switch/random-switch.component';

@Component({
    selector: 'app-entity-edit-general',
    standalone: true,
    imports: [
        NgIf,
        NgForOf,
        FormsModule,
        ControlLineComponent,
        ControlLineSliderComponent,
        RandomSwitchComponent,
        NzButtonModule,
        NzIconModule,
        NzInputModule,
        NzPopoverModule,
        NzRadioModule,
        NzSwitchModule,
    ],
    templateUrl: './entity-edit-general.component.html',
    styleUrls: ['./entity-edit-general.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntityEditGeneralComponent {
    @Input() entity!: Entity;

    @Output() dimensionsChanged: EventEmitter<void> = new EventEmitter();

    entityTypes: EntityType[] = Object.values(EntityType);
    nameEditPopOverVisible: boolean = false;

    constructor(public entityService: EntityService) {}
}
