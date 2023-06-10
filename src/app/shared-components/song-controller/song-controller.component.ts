import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSliderModule } from 'ng-zorro-antd/slider';

import { AudioSourceService } from '../../source-services/audio.source.service';

@Component({
    selector: 'app-song-controller',
    standalone: true,
    imports: [AsyncPipe, NgIf, FormsModule, NzIconModule, NzButtonModule, NzSliderModule],
    templateUrl: './song-controller.component.html',
    styleUrls: ['./song-controller.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SongControllerComponent {
    @Input() @HostBinding('class.show-background') showBackground: boolean = false;

    constructor(public audioService: AudioSourceService) {}
}
