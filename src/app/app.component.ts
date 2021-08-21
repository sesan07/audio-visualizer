import { AfterViewInit, Component, ElementRef, HostListener, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { IEntityConfig, EntityType } from './entity/entity.types';
import { animations } from './shared/animations';
import { AudioService } from './shared/audio-service/audio.service';
import { EntityService } from './entity/entity.service';
import { EntityEmitterType, IEntityEmitterConfig } from './entity-emitter/entity-emitter.types';
import { NzMessageService } from 'ng-zorro-antd/message';
import { EntityEmitterService } from './entity-emitter/entity-emitter.service';
import { BackgroundImageService } from './background-image.service';
import { PresetService } from './shared/preset-service/preset.service';
import { VisualizerService } from './entity/visualizer-entity/visualizer.service';
import { ImageService } from './entity/image-entity/image.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    animations: animations
})
export class AppComponent implements OnInit, AfterViewInit {
    @ViewChild('audio') audioElement: ElementRef<HTMLAudioElement>;
    @ViewChild('audioFileInput') audioFileInputElement: ElementRef<HTMLInputElement>;
    @ViewChild('backgroundFileInput') backgroundFileInputElement: ElementRef<HTMLInputElement>;
    @ViewChild('entityView') entityView: ElementRef<HTMLElement>;
    @ViewChild('entityViewContent') entityViewContentElement: ElementRef<HTMLElement>;

    @ViewChildren('hiddenImage') hiddenImages: QueryList<ElementRef<HTMLImageElement>>;

    @HostListener('window:resize')
    onWindowResize(): void {
        this._updateEntityViewContentScale();
    }

    addEntityOptions: EntityType[] = Object.values(EntityType);
    addEmitterOptions: EntityEmitterType[] = Object.values(EntityEmitterType);

    modeOptions: any[] = [
        {
            name: 'Frequency',
            value: 'frequency'
        },
        {
            name: 'Time Domain',
            value: 'timeDomain'
        },
    ];
    decibelRange: [number, number] = [-80, -20];

    isControlViewOpen: boolean = true;
    controlViewWidth: number;
    controlViewContentWidth: number;
    entityViewContentScale: number;

    addUrlPopOverVisible: boolean;
    savePresetPopOverVisible: boolean;

    private readonly _controlViewWidth: number = 500;

    get isPlaying(): boolean {
        return this.audioElement ? !this.audioElement.nativeElement.paused : false;
    }

    constructor(public audioService: AudioService,
                public backgroundImageService: BackgroundImageService,
                public entityService: EntityService,
                public entityEmitterService: EntityEmitterService,
                public presetService: PresetService,
                public imageService: ImageService,
                private _visualizerService: VisualizerService,
                private _elementRef: ElementRef<HTMLElement>,
                private _renderer: Renderer2) {
    }

    ngOnInit(): void {
        this.audioService.setActiveSource(this.audioService.sources[0]);
        this.backgroundImageService.setActiveSource(this.backgroundImageService.sources[0])

        this.controlViewWidth = this.isControlViewOpen ? this._controlViewWidth : 0;
        this.controlViewContentWidth = this._controlViewWidth;
    }

    ngAfterViewInit(): void {
        this.audioService.setUp(this.audioElement.nativeElement)
        this.audioService.setDecibelRange(this.decibelRange[0], this.decibelRange[1])

        this._visualizerService.entityView = this.entityViewContentElement.nativeElement;
        this.imageService.entityView = this.entityViewContentElement.nativeElement;

        this.imageService.setImageElements(this.hiddenImages.map(ref => ref.nativeElement));
        this.hiddenImages.changes.subscribe(() => {
            this.imageService.setImageElements(this.hiddenImages.map(ref => ref.nativeElement));
        })

        // Microsoft Edge's dimensions at AfterViewInit aren't correct, so wait a bit
        setTimeout(() => this._updateEntityViewContentScale(), 500)
    }

    onPlayPause(): void {
        this.isPlaying ? this.audioService.pause() : this.audioService.play()
    }

    onNextSong(): void {
        this.audioService.playNextSong()
    }

    onPrevSong(): void {
        this.audioService.playPreviousSong()
    }

    onEnded(): void {
        this.audioService.playNextSong();
    }

    onAddEntity(type: EntityType): void {
        this.entityService.addEntity(type, true, true)
    }

    onAddEmitter(type: EntityEmitterType): void {
        this.entityEmitterService.addEmitter(type)
    }

    onEntitySelected(config: IEntityConfig, event?: MouseEvent): void {
        this.entityService.activeEntity = config;
        event?.stopPropagation();
    }

    onEmitterSelected(config: IEntityEmitterConfig, event?: MouseEvent): void {
        this.entityEmitterService.activeEmitter = config;
        event?.stopPropagation();
    }

    onRemoveEntity(entity: IEntityConfig): void {
        this.entityService.removeEntity(entity, true)
    }

    onRemoveEmitter(entityEmitter: IEntityEmitterConfig): void {
        this.entityEmitterService.removeEmitter(entityEmitter)
    }

    onEntityViewClicked(): void {
        this.entityService.activeEntity = null;
        this.entityEmitterService.activeEmitter = null;
    }

    onDecibelChanged(): void {
        this.audioService.setDecibelRange(this.decibelRange[0], this.decibelRange[1])
    }

    onAudioFileUpload(): void {
        const files: FileList = this.audioFileInputElement.nativeElement.files;
        this.audioService.addFileSources(files)
    }

    onBackgroundFileUpload(): void {
        const files: FileList = this.backgroundFileInputElement.nativeElement.files;
        this.backgroundImageService.addFileSources(files)
    }

    onAddUrl(url?: string, name?: string): void {
        this.backgroundImageService.addUrlSource(url, name);
        this.addUrlPopOverVisible = false;
    }

    toggleControlView(): void {
        this.isControlViewOpen = !this.isControlViewOpen;

        this.controlViewWidth = this.isControlViewOpen ? this._controlViewWidth : 0;
        this._updateEntityViewContentScale();
    }

    private _updateEntityViewContentScale(): void {
        const entityViewWidth: number = this.entityViewContentElement.nativeElement.clientWidth;
        this.entityViewContentScale = (entityViewWidth - this.controlViewWidth) / entityViewWidth
        this._renderer.setStyle(this.entityViewContentElement.nativeElement, 'transform', `scale(${this.entityViewContentScale})`)
    }
}
