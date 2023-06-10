import { NgForOf, NgSwitch, NgSwitchCase } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';

import { BarContent } from '../entity-content/bar/bar.content.types';
import { BarcleContent } from '../entity-content/barcle/barcle.content.types';
import { CircleContent } from '../entity-content/circle/circle.content.types';
import { ImageContent } from '../entity-content/image/image.content.types';
import { EntityService } from '../entity-service/entity.service';
import { Entity, EntityType } from '../entity-service/entity.types';
import { EntityNamePipe } from '../shared-components/entity-name/entity-name.pipe';
import { EntityEditBarComponent } from './entity-edit-bar/entity-edit-bar.component';
import { EntityEditBarcleComponent } from './entity-edit-barcle/entity-edit-barcle.component';
import { EntityEditCircleComponent } from './entity-edit-circle/entity-edit-circle.component';
import { EntityEditGeneralComponent } from './entity-edit-general/entity-edit-general.component';
import { EntityEditImageComponent } from './entity-edit-image/entity-edit-image.component';

@Component({
    selector: 'app-entity-edit',
    standalone: true,
    imports: [
        NgForOf,
        NgSwitch,
        NgSwitchCase,
        FormsModule,
        EntityEditGeneralComponent,
        EntityEditBarComponent,
        EntityEditBarcleComponent,
        EntityEditCircleComponent,
        EntityEditImageComponent,
        EntityNamePipe,
        NzCardModule,
        NzCollapseModule,
    ],
    templateUrl: './entity-edit.component.html',
    styleUrls: ['./entity-edit.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntityEditComponent {
    @Input() entity!: Entity;

    entityType: typeof EntityType = EntityType;

    get entityAsBar(): Entity<BarContent> {
        return this.entity as Entity<BarContent>;
    }

    get entityAsBarcle(): Entity<BarcleContent> {
        return this.entity as Entity<BarcleContent>;
    }

    get entityAsCircle(): Entity<CircleContent> {
        return this.entity as Entity<CircleContent>;
    }

    get entityAsImage(): Entity<ImageContent> {
        return this.entity as Entity<ImageContent>;
    }

    constructor(private _entityService: EntityService) {}

    onDimensionsChange(): void {
        this._entityService.setEntityDimensions(this.entity);
    }
}
