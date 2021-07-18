import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IEntityConfig, EntityType } from './entity/entity.types';
import { animations } from './shared/animations';
import { AudioService } from './shared/audio-service/audio.service';
import { EntityService } from './entity/entity.service';
import { EntityEmitterType, IEntityEmitterConfig } from './entity-emitter/entity-emitter.types';
import { IAudioConfig } from './shared/audio-service/audio.service.types';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { EntityEmitterService } from './entity-emitter/entity-emitter.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    animations: animations
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('audio') audioElement: ElementRef<HTMLAudioElement>;
    @ViewChild('fileInput') fileInputElement: ElementRef<HTMLInputElement>;

    // Todo support adding images

    addVisualizerOptions: EntityType[] = Object.values(EntityType);
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
    selectedAudioConfig: IAudioConfig = this.audioService.audioConfigs[5];

    private _destroy$: Subject<void> = new Subject();

    get isPlaying(): boolean {
        return this.audioElement ? !this.audioElement.nativeElement.paused : false;
    }

    constructor(public audioService: AudioService,
                public entityService: EntityService,
                public entityEmitterService: EntityEmitterService,
                private _messageService: NzMessageService) {
    }

    ngOnInit(): void {
        this.audioService.activeConfigChange$
            .pipe(takeUntil(this._destroy$))
            .subscribe(config => this.selectedAudioConfig = config)
        this.audioService.setActiveConfig(this.selectedAudioConfig);
    }

    ngAfterViewInit(): void {
        this.audioService.setUp(this.audioElement.nativeElement)
        this.audioService.setDecibelRange(this.decibelRange[0], this.decibelRange[1])
    }

    ngOnDestroy(): void {
        this._destroy$.next();
        this._destroy$.complete();
    }

    getAudioName(config: IAudioConfig): string {
        if (config.isAsset) {
            return (config.src as string).split('/').pop().split('.').shift()
        } else {
            return config.file.name.split('.').shift()
        }
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

    onAddVisualizer(type: EntityType): void {
        this.entityService.addVisualizer(type, true)
    }

    onAddEmitter(type: EntityEmitterType): void {
        this.entityEmitterService.addEmitter(type)
    }

    onVisualizerSelected(config: IEntityConfig, event?: MouseEvent): void {
        this.entityService.activeVisualizer = config;
        event?.stopPropagation();
    }

    onEmitterSelected(config: IEntityEmitterConfig, event?: MouseEvent): void {
        this.entityEmitterService.activeEmitter = config;
        event?.stopPropagation();
    }

    onRemoveVisualizer(index: number): void {
        this.entityService.removeVisualizer(index)
    }

    onRemoveEmitter(index: number): void {
        this.entityEmitterService.removeEmitter(index)
    }

    onVisualizerViewClicked(): void {
        this.entityService.activeVisualizer = null;
        this.entityEmitterService.activeEmitter = null;
    }

    onDecibelChanged(): void {
        this.audioService.setDecibelRange(this.decibelRange[0], this.decibelRange[1])
    }

    onFileChange() {
        const files: FileList = this.fileInputElement.nativeElement.files;
        if (this.audioService.uploadAudioFiles(files)) {
            this._messageService.success('Upload successful')
        }
    }
}
