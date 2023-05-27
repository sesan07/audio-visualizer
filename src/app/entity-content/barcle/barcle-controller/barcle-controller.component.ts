import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Entity } from '../../../app.types';
import { AudioSourceService } from '../../../shared/source-services/audio.source.service';
import { BarcleContent } from '../barcle.content.types';
import { BarcleContentService } from '../barcle.content.service';
import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { ControlLineComponent } from 'src/app/shared/components/control-line/control-line.component';
import { ColorPickerComponent } from 'src/app/shared/components/color-picker/color-picker.component';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { RandomSwitchComponent } from 'src/app/shared/components/random-switch/random-switch.component';

@Component({
    selector: 'app-barcle-controller',
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
    templateUrl: './barcle-controller.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarcleControllerComponent {
    @Input() entity!: Entity<BarcleContent>;
    @Input() isEmitter: boolean = false;

    get content(): BarcleContent {
        return this.entity.content;
    }

    sampleCountOptions: number[];

    constructor(private _audioService: AudioSourceService, private _barcleContentService: BarcleContentService) {
        this.sampleCountOptions = this._audioService.sampleCounts;
    }

    onDimensionsChange(): void {
        this._barcleContentService.setEntityDimensions(this.entity);
    }
}
