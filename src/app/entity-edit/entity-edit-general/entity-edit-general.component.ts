import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { ControlLineComponent } from 'src/app/shared/components/control-line/control-line.component';
import { ControlLineSliderComponent } from 'src/app/shared/components/control-line-slider/control-line-slider.component';
import { Entity, EntityContent, EntityType } from 'src/app/app.types';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { FormsModule } from '@angular/forms';
import { AppService } from 'src/app/app.service';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { RandomSwitchComponent } from 'src/app/shared/components/random-switch/random-switch.component';

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
})
export class EntityEditGeneralComponent {
    @Input() entity!: Entity;

    @Output() dimensionsChanged: EventEmitter<void> = new EventEmitter();

    entityTypes: EntityType[] = Object.values(EntityType);
    nameEditPopOverVisible: boolean = false;

    constructor(private _entityService: AppService) {}

    onEntityTypeChange(newType: EntityType): void {
        this.entity.type = newType;

        const entityContent: EntityContent = this._entityService.getDefaultEntityContent(
            newType,
            !!this.entity.isEmitted
        );
        Object.assign(this.entity.content, entityContent);
        this._entityService.setEntityDimensions(this.entity);
    }

    onToggleEmitter(): void {
        this._entityService.toggleEmitter(this.entity);
    }
}
