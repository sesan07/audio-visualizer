import { NgForOf, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzSwitchModule } from 'ng-zorro-antd/switch';

import { BarContentService } from 'src/app/entity-content/bar/bar.content.service';
import { BarContent } from 'src/app/entity-content/bar/bar.content.types';
import { Entity } from 'src/app/entity-service/entity.types';
import { ColorPickerComponent } from 'src/app/shared-components/color-picker/color-picker.component';
import { ControlLineComponent } from 'src/app/shared-components/control-line/control-line.component';
import { RandomSwitchComponent } from 'src/app/shared-components/random-switch/random-switch.component';
import { AudioSourceService } from 'src/app/source-services/audio.source.service';

@Component({
    selector: 'app-entity-edit-bar',
    standalone: true,
    imports: [
        NgIf,
        NgForOf,
        FormsModule,
        ControlLineComponent,
        ColorPickerComponent,
        RandomSwitchComponent,
        NzSelectModule,
        NzInputNumberModule,
        NzSliderModule,
        NzSwitchModule,
    ],
    templateUrl: './entity-edit-bar.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntityEditBarComponent {
    @Input() entity!: Entity<BarContent>;
    @Input() isEmitter: boolean = false;

    get content(): BarContent {
        return this.entity.content;
    }

    sampleCountOptions: number[];

    constructor(private _audioService: AudioSourceService, private _barContentService: BarContentService) {
        this.sampleCountOptions = this._audioService.sampleCounts;
    }

    onDimensionsChange(): void {
        this._barContentService.setEntityDimensions(this.entity);
    }
}
