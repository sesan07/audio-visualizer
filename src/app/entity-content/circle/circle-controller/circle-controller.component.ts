import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Entity } from '../../../app.types';
import { AudioSourceService } from '../../../shared/source-services/audio.source.service';
import { CircleContent } from '../circle.content.types';
import { CircleContentService } from '../circle.content.service';
import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { ColorPickerComponent } from 'src/app/shared/components/color-picker/color-picker.component';
import { ControlLineComponent } from 'src/app/shared/components/control-line/control-line.component';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { RandomSwitchComponent } from 'src/app/shared/components/random-switch/random-switch.component';

@Component({
    selector: 'app-circle-controller',
    standalone: true,
    imports: [
        // CommonModule,
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
    templateUrl: './circle-controller.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CircleControllerComponent {
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
