import { ChangeDetectionStrategy, Component, Input, SimpleChanges } from '@angular/core';
import { AsyncPipe, CommonModule, NgForOf, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Entity, EntityContent, EntityType } from '../app.types';
import { ControlLineComponent } from '../shared/components/control-line/control-line.component';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { FormsModule } from '@angular/forms';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { AppService } from '../app.service';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { BarControllerComponent } from '../entity-content/bar/bar-controller/bar-controller.component';
import { BarcleControllerComponent } from '../entity-content/barcle/barcle-controller/barcle-controller.component';
import { NzCollapseComponent, NzCollapseModule } from 'ng-zorro-antd/collapse';
import { BarContent } from '../entity-content/bar/bar.content.types';
import { BarcleContent } from '../entity-content/barcle/barcle.content.types';
import { CircleContent } from '../entity-content/circle/circle.content.types';
import { ImageContent } from '../entity-content/image/image.content.types';
import { CircleControllerComponent } from '../entity-content/circle/circle-controller/circle-controller.component';
import { ImageControllerComponent } from '../entity-content/image/image-controller/image-controller.component';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { ControlLineSliderComponent } from '../shared/components/control-line-slider/control-line-slider.component';
import { EntityEditGeneralComponent } from './entity-edit-general/entity-edit-general.component';

@Component({
    selector: 'app-entity-edit',
    standalone: true,
    imports: [
        // CommonModule,
        NgIf,
        NgForOf,
        NgSwitch,
        NgSwitchCase,
        AsyncPipe,
        FormsModule,
        ControlLineComponent,
        ControlLineSliderComponent,
        EntityEditGeneralComponent,
        BarControllerComponent,
        BarcleControllerComponent,
        CircleControllerComponent,
        ImageControllerComponent,
        NzCardModule,
        NzCollapseModule,
        NzButtonModule,
        NzIconModule,
        NzRadioModule,
        NzPopoverModule,
        NzInputNumberModule,
        NzSliderModule,
        NzSwitchModule,
        NzToolTipModule,
    ],
    templateUrl: './entity-edit.component.html',
    styleUrls: ['./entity-edit.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntityEditComponent {
    @Input() entity!: Entity;

    EntityType: typeof EntityType = EntityType;

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

    constructor(private _entityService: AppService) {}

    onDimensionsChange(): void {
        this._entityService.setEntityDimensions(this.entity);
    }
}
