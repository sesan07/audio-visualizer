import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    HostBinding,
    HostListener,
    NgZone,
    OnInit,
    QueryList,
    Renderer2,
    TrackByFunction,
    ViewChild,
    ViewChildren,
} from '@angular/core';
import { Entity, EntityLayer, EntityType } from './app.types';
import { animations } from './shared/animations';
import { AudioSourceService } from './shared/source-services/audio.source.service';
import { AppService } from './app.service';
import { BackgroundImageSourceService } from './shared/source-services/background-image.source.service';
import { PresetService } from './shared/preset-service/preset.service';
import { BarContentService } from './entity-content/bar/bar.content.service';
import { BarcleContentService } from './entity-content/barcle/barcle.content.service';
import { CircleContentService } from './entity-content/circle/circle.content.service';
import { ImageContentService } from './entity-content/image/image.content.service';
import { Source } from './shared/source-services/base.source.service.types';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { trackByLayerId } from './shared/utils';
import { EntityEditComponent } from './entity-edit/entity-edit.component';
import { LayerListControllerComponent } from './layer-list-controller/layer-list-controller.component';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { SourcePickerComponent } from './shared/components/source-picker/source-picker.component';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { FormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { ControlLineComponent } from './shared/components/control-line/control-line.component';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { SongControllerComponent } from './shared/components/song-controller/song-controller.component';
import { EntityCanvasComponent } from './entity-canvas/entity-canvas.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NgStyle, NgIf, NgFor, AsyncPipe } from '@angular/common';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { BackgroundCanvasComponent } from './background-canvas/background-canvas.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    animations: animations,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        AsyncPipe,
        NgIf,
        NgFor,
        NgStyle,
        FormsModule,
        EntityCanvasComponent,
        SongControllerComponent,
        ControlLineComponent,
        SourcePickerComponent,
        LayerListControllerComponent,
        EntityEditComponent,
        BackgroundCanvasComponent,
        NzButtonModule,
        NzWaveModule,
        NzIconModule,
        NzCollapseModule,
        NzSelectModule,
        NzPopoverModule,
        NzInputModule,
        NzInputNumberModule,
        NzSliderModule,
        NzRadioModule,
    ],
})
export class AppComponent implements OnInit, AfterViewInit {
    @ViewChild('audio') audioElement!: ElementRef<HTMLAudioElement>;
    @ViewChild('entityView') entityViewElement!: ElementRef<HTMLElement>;
    @ViewChild('toggleButton', { read: ElementRef }) toggleButton!: ElementRef<HTMLButtonElement>;

    private _layers: EntityLayer[] = [];

    @HostListener('mousemove')
    onMouseMove(): void {
        const showResizeCursor: boolean = this._layers.some(layer =>
            layer.entities.some(entity => entity.showResizeCursor)
        );
        const showMoveCursor: boolean = this._layers.some(layer =>
            layer.entities.some(entity => entity.showMoveCursor)
        );

        this.entityViewCursor = showResizeCursor ? 'nwse-resize' : showMoveCursor ? 'move' : 'auto';

        this.toggleButtonOpacity = 1;
        this._mouseMove$.next();
    }

    @HostListener('window:keydown.space', ['$event'])
    onSpaceKeyDown(event: KeyboardEvent): void {
        if (this.isControlViewOpen) {
            return;
        }
        this.audioService.togglePlay();
        event.preventDefault();
    }

    @HostListener('window:resize')
    onWindowResize(): void {
        this._updateEntityViewScale();
    }

    addEntityOptions: EntityType[] = Object.values(EntityType);

    currentAudioTime: number = 0;
    backgroundOpacity: number = 0.5;
    backgroundOomph: number = 0.2;
    backgroundScale: number = 1;
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

    toggleButtonOpacity: number = 1;
    isControlViewOpen: boolean = true;
    controlViewWidth: number;
    controlViewContentWidth: number;
    entityViewScale: number = 1;
    entityViewCursor: string = 'auto';

    savePresetPopOverVisible: boolean = false;

    trackByLayerId: TrackByFunction<EntityLayer> = trackByLayerId;

    private readonly _controlViewWidth: number = 600;
    private _mouseMove$: Subject<void> = new Subject();

    constructor(
        public audioService: AudioSourceService,
        public backgroundImageService: BackgroundImageSourceService,
        public entityService: AppService,
        public presetService: PresetService,
        private _barContentService: BarContentService,
        private _barcleContentService: BarcleContentService,
        private _circleContentService: CircleContentService,
        private _imageContentService: ImageContentService,
        private _renderer: Renderer2,
        private _ngZone: NgZone
    ) {
        this.controlViewWidth = this.isControlViewOpen ? this._controlViewWidth : 0;
        this.controlViewContentWidth = this._controlViewWidth;
    }

    ngOnInit(): void {
        this.audioService.setActiveSource(this.audioService.sources[0]);
        this.backgroundImageService.setActiveSource(this.backgroundImageService.sources[0]);

        this._mouseMove$
            .pipe(debounceTime(1500))
            .subscribe(() => (this.toggleButtonOpacity = this.isControlViewOpen ? 1 : 0));

        this.entityService.layers$.subscribe(l => (this._layers = l));
    }

    ngAfterViewInit(): void {
        this.audioService.setUp(this.audioElement.nativeElement);
        this.audioService.setDecibelRange(this.decibelRange[0], this.decibelRange[1]);

        this._barContentService.setEntityView(this.entityViewElement.nativeElement);
        this._barcleContentService.setEntityView(this.entityViewElement.nativeElement);
        this._circleContentService.setEntityView(this.entityViewElement.nativeElement);
        this._imageContentService.setEntityView(this.entityViewElement.nativeElement);

        setTimeout(() => {
            const layerId: string = this.entityService.addNewLayer();
            this.entityService.addEntityType(EntityType.BAR, layerId);
            // this.entityService.addEntityType(EntityType.BAR, layerId);
            // this.entityService.addEntityType(EntityType.BAR, layerId);
            // this.entityService.addEntityType(EntityType.BAR, layerId);
        });

        // Microsoft Edge's dimensions at AfterViewInit aren't correct, so wait a bit
        // setTimeout(() => {
        this._updateEntityViewScale();
        this._ngZone.runOutsideAngular(() => this._updateBackgroundScale());

        if (this.presetService.presets.length > 0) {
            this.presetService.setActivePreset(this.presetService.presets[0]);
        }
        // }, 1000);
    }

    formatTime(seconds: number): string {
        seconds = isNaN(seconds) ? 0 : seconds;
        const hasHours: boolean = Math.floor(seconds / 3600) > 0;
        return new Date(1000 * seconds).toISOString().substr(hasHours ? 11 : 14, hasHours ? 8 : 5);
    }

    onEntityViewClicked(): void {
        this.entityService.setActiveEntity(null);
        // this.emitterService.setActiveEmitter(null);
    }

    onDecibelChanged(): void {
        this.audioService.setDecibelRange(this.decibelRange[0], this.decibelRange[1]);
    }

    onSongSelected(source: Source): void {
        this.audioService.setActiveSource(source);
        setTimeout(() => this.audioService.play());
    }

    onToggleControlView(): void {
        this.isControlViewOpen = !this.isControlViewOpen;

        this.controlViewWidth = this.isControlViewOpen ? this._controlViewWidth : 0;
        this._updateEntityViewScale();
        this.toggleButton.nativeElement.blur();
    }

    private _updateEntityViewScale(): void {
        const entityViewWidth: number = this.entityViewElement.nativeElement.clientWidth;
        this.entityViewScale = (entityViewWidth - this.controlViewWidth) / entityViewWidth;
        this._renderer.setStyle(this.entityViewElement.nativeElement, 'transform', `scale(${this.entityViewScale})`);
    }

    private _updateBackgroundScale(): void {
        this.backgroundScale = 1 + this.backgroundOomph * this.audioService.oomph.value;
        requestAnimationFrame(() => this._updateBackgroundScale());
    }
}
