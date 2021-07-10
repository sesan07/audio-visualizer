import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { IVisualizerConfig, VisualizerType } from './visualizer-view/visualizer/visualizer.types';
import { animations } from './shared/animations';
import { AudioService } from './services/audio.service';
import { VisualizerService } from './services/visualizer.service';
import { EmitterType, IEmitterConfig } from './visualizer-view/visualizer-emitter/visualizer-emitter.types';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    animations: animations
})
export class AppComponent implements AfterViewInit {
    @ViewChild('audioElement') audioElement: ElementRef<HTMLAudioElement>;

    // Todo support adding images

    addVisualizerOptions: VisualizerType[] = Object.values(VisualizerType);
    addEmitterOptions: EmitterType[] = Object.values(EmitterType);

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

    get isPlaying(): boolean {
        return this.audioElement ? !this.audioElement.nativeElement.paused : false;
    }

    constructor(public audioService: AudioService, public visualizerService: VisualizerService) {
    }

    ngAfterViewInit(): void {
        this.audioService.setUp(this.audioElement.nativeElement)
        this.audioService.setDecibelRange(this.decibelRange[0], this.decibelRange[1])
    }

    getAudioName(src: string): string {
        return src.split('/').pop().split('.').shift();
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

    onAddVisualizer(type: VisualizerType): void {
        const visualizer: IVisualizerConfig = this.visualizerService.getDefaultVisualizer(type)
        this.visualizerService.addVisualizer(visualizer, true)
    }

    onAddEmitter(type: EmitterType): void {
        this.visualizerService.addEmitter(type)
    }

    onVisualizerSelected(config: IVisualizerConfig, event?: MouseEvent): void {
        this.visualizerService.activeVisualizer = config;
        event?.stopPropagation();
    }

    onEmitterSelected(config: IEmitterConfig, event?: MouseEvent): void {
        this.visualizerService.activeEmitter = config;
        event?.stopPropagation();
    }

    onRemoveVisualizer(index: number): void {
        this.visualizerService.removeVisualizer(index)
    }

    onRemoveEmitter(index: number): void {
        this.visualizerService.removeEmitter(index)
    }

    onVisualizerViewClicked(): void {
        this.visualizerService.activeVisualizer = null;
        this.visualizerService.activeEmitter = null;
    }

    onDecibelChanged(): void {
        this.audioService.setDecibelRange(this.decibelRange[0], this.decibelRange[1])
    }
}
