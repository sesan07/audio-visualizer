import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AudioSourceService } from '../../../shared/source-services/audio.source.service';
import { Entity } from '../../../app.types';
import { BarContent } from '../bar.content.types';
import { BarContentService } from '../bar.content.service';
import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { ControlLineComponent } from 'src/app/shared/components/control-line/control-line.component';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { FormsModule } from '@angular/forms';
import { ColorPickerComponent } from 'src/app/shared/components/color-picker/color-picker.component';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { RandomSwitchComponent } from 'src/app/shared/components/random-switch/random-switch.component';

@Component({
    selector: 'app-bar-controller',
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
        NzSwitchModule,
    ],
    templateUrl: './bar-controller.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarControllerComponent {
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
