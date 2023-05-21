import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { AudioSourceService } from '../../source-services/audio.source.service';

@Component({
    selector: 'app-song-controller',
    standalone: true,
    imports: [CommonModule, FormsModule, NzIconModule, NzButtonModule, NzSliderModule],
    templateUrl: './song-controller.component.html',
    styleUrls: ['./song-controller.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SongControllerComponent {
    constructor(public audioService: AudioSourceService) {}
}
