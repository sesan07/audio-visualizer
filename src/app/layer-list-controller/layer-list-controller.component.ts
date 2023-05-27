import { ChangeDetectionStrategy, Component, Input, TrackByFunction } from '@angular/core';
import { AsyncPipe, CommonModule, NgForOf, NgIf } from '@angular/common';
import { CdkListboxModule } from '@angular/cdk/listbox';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { AppService } from '../app.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { LayerEntityComponent } from './layer-entity/layer-entity.component';
import { Entity, EntityLayer, EntityType } from '../app.types';
import { trackByEntityId, trackByLayerId } from '../shared/utils';
import { animations } from '../shared/animations';

@Component({
    selector: 'app-layer-list-controller',
    standalone: true,
    imports: [
        AsyncPipe,
        NgIf,
        NgForOf,
        LayerEntityComponent,
        DragDropModule,
        NzCardModule,
        NzCollapseModule,
        NzButtonModule,
        NzIconModule,
        NzDropDownModule,
    ],
    templateUrl: './layer-list-controller.component.html',
    styleUrls: ['./layer-list-controller.component.scss'],
    animations: animations,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayerListControllerComponent {
    entityTypes: EntityType[] = Object.values(EntityType);

    trackByEntityId: TrackByFunction<Entity> = trackByEntityId;
    trackByLayerId: TrackByFunction<EntityLayer> = trackByLayerId;

    constructor(public entityService: AppService) {}

    onEntityDropped(event: CdkDragDrop<EntityLayer, EntityLayer, Entity>): void {
        this.entityService.moveEntity(event.item.data, event.previousIndex, event.currentIndex);
    }
}
