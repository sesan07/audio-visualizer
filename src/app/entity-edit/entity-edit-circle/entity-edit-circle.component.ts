import { NgForOf, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSliderModule } from 'ng-zorro-antd/slider';

import { CircleContentService } from 'src/app/entity-content/circle/circle.content.service';
import { CircleContent } from 'src/app/entity-content/circle/circle.content.types';
import { Entity } from 'src/app/entity-service/entity.types';
import { ColorPickerComponent } from 'src/app/shared-components/color-picker/color-picker.component';
import { ControlLineComponent } from 'src/app/shared-components/control-line/control-line.component';
import { RandomSwitchComponent } from 'src/app/shared-components/random-switch/random-switch.component';
import { AudioSourceService } from 'src/app/source-services/audio.source.service';

@Component({
    selector: 'app-entity-edit-circle',
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
    ],
    templateUrl: './entity-edit-circle.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntityEditCircleComponent {
    @Input() entity!: Entity<CircleContent>;
    @Input() isEmitter: boolean = false;

    get content(): CircleContent {
        return this.entity.content;
    }

    sampleCountOptions: number[];

    constructor(private _audioService: AudioSourceService, private _circleContentService: CircleContentService) {
        this.sampleCountOptions = this._audioService.sampleCounts;
    }

    onDimensionsChange(): void {
        this._circleContentService.setEntityDimensions(this.entity);
    }
}
