import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { IEntityConfig, EntityType } from './entity/entity.types';
import { animations } from './shared/animations';
import { AudioService } from './shared/audio-service/audio.service';
import { EntityService } from './entity/entity.service';
import { EntityEmitterType, IEntityEmitterConfig } from './entity-emitter/entity-emitter.types';
import { NzMessageService } from 'ng-zorro-antd/message';
import { EntityEmitterService } from './entity-emitter/entity-emitter.service';
import { BackgroundImageService } from './background-image.service';

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
    @ViewChild('entityViewContent') entityViewContentElement: ElementRef<HTMLElement>;

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

    private readonly _controlViewWidth: number = 500;

    get isPlaying(): boolean {
        return this.audioElement ? !this.audioElement.nativeElement.paused : false;
    }

    constructor(public audioService: AudioService,
                public backgroundImageService: BackgroundImageService,
                public entityService: EntityService,
                public entityEmitterService: EntityEmitterService,
                private _elementRef: ElementRef<HTMLElement>,
                private _messageService: NzMessageService,
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
        this.entityService.addEntity(type, true)
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

    onRemoveEntity(index: number): void {
        this.entityService.removeEntity(index)
    }

    onRemoveEmitter(index: number): void {
        this.entityEmitterService.removeEmitter(index)
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
        this.audioService.uploadFiles(files)
    }

    onBackgroundFileUpload(): void {
        const files: FileList = this.backgroundFileInputElement.nativeElement.files;
        this.backgroundImageService.uploadFiles(files)
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
