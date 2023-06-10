import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, TrackByFunction } from '@angular/core';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';

import { animations } from '../animations';
import { EntityService } from '../entity-service/entity.service';
import { Entity, EntityType } from '../entity-service/entity.types';
import { EntityItemComponent } from './entity-item/entity-item.component';

@Component({
    selector: 'app-entity-list',
    standalone: true,
    imports: [
        AsyncPipe,
        NgIf,
        NgForOf,
        EntityItemComponent,
        DragDropModule,
        NzCardModule,
        NzCollapseModule,
        NzButtonModule,
        NzIconModule,
        NzDropDownModule,
    ],
    templateUrl: './entity-list.component.html',
    styleUrls: ['./entity-list.component.scss'],
    animations: animations,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntityListComponent {
    entityTypes: EntityType[] = Object.values(EntityType);

    trackByEntityId: TrackByFunction<Entity> = (_: number, entity: Entity): string => entity.id;

    constructor(public entityService: EntityService) {}

    onEntityDropped(event: CdkDragDrop<void>): void {
        this.entityService.moveEntity(event.previousIndex, event.currentIndex);
    }
}
