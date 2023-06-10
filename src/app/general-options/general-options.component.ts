import { AsyncPipe, NgForOf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSliderModule } from 'ng-zorro-antd/slider';

import { EntityService } from '../entity-service/entity.service';
import { PresetService } from '../preset-service/preset.service';
import { ControlLineSliderComponent } from '../shared-components/control-line-slider/control-line-slider.component';
import { ControlLineComponent } from '../shared-components/control-line/control-line.component';
import { SourcePickerComponent } from '../shared-components/source-picker/source-picker.component';
import { AudioSourceService } from '../source-services/audio.source.service';
import { BackgroundImageSourceService } from '../source-services/background-image.source.service';
import { Source } from '../source-services/base.source.service.types';

@Component({
    selector: 'app-general-options',
    standalone: true,
    imports: [
        AsyncPipe,
        NgForOf,
        FormsModule,
        ControlLineComponent,
        ControlLineSliderComponent,
        SourcePickerComponent,
        NzButtonModule,
        NzIconModule,
        NzCardModule,
        NzCollapseModule,
        NzSelectModule,
        NzPopoverModule,
        NzSliderModule,
        NzInputModule,
        NzInputNumberModule,
        NzRadioModule,
    ],
    templateUrl: './general-options.component.html',
    styleUrls: ['./general-options.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneralOptionsComponent {
    modeOptions: any[] = [
        {
            name: 'Frequency',
            value: 'frequency',
        },
        {
            name: 'Time Domain',
            value: 'timeDomain',
        },
    ];
    decibelRange: [number, number] = [-80, -20];

    savePresetPopOverVisible: boolean = false;

    constructor(
        public audioService: AudioSourceService,
        public bgImageService: BackgroundImageSourceService,
        public entityService: EntityService,
        public presetService: PresetService
    ) {}

    onDecibelChanged(): void {
        this.audioService.setDecibelRange(this.decibelRange[0], this.decibelRange[1]);
    }

    onSongSelected(source: Source): void {
        this.audioService.setActiveSource(source, true);
    }
}
