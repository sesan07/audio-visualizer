import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { animations } from '../animations';
import { EntityEditComponent } from '../entity-edit/entity-edit.component';
import { EntityListComponent } from '../entity-list/entity-list.component';
import { EntityService } from '../entity-service/entity.service';
import { GeneralOptionsComponent } from '../general-options/general-options.component';
import { SongControllerComponent } from '../shared-components/song-controller/song-controller.component';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [
        AsyncPipe,
        NgIf,
        SongControllerComponent,
        GeneralOptionsComponent,
        EntityListComponent,
        EntityEditComponent,
    ],
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
    animations: [animations],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
    @Input() viewWidth: number = 600;

    constructor(public entityService: EntityService) {}
}
