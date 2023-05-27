import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Entity } from '../../app.types';
import { AppService } from '../../app.service';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';

@Component({
    selector: 'app-layer-entity',
    standalone: true,
    imports: [AsyncPipe, NzButtonModule, NzIconModule, NzDropDownModule],
    templateUrl: './layer-entity.component.html',
    styleUrls: ['./layer-entity.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayerEntityComponent {
    @Input() entity!: Entity;

    constructor(public entityService: AppService) {}
}
