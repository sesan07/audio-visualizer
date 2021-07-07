import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { IVisualizerConfig, VisualizerType } from './visualizer/visualizer.types';
import { animations } from './shared/animations';
import { AudioService } from './services/audio.service';
import { VisualizerService } from './services/visualizer.service';
import { EmitterType, IEmitterConfig } from './visualizer-emitter/visualizer-emitter.types';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    animations: animations
})
export class AppComponent implements AfterViewInit {
    @ViewChild('audioElement') audioElement: ElementRef<HTMLAudioElement>;

    addVisualizerOptions: VisualizerType[] = Object.values(VisualizerType);
    selectedAddVisualizer: VisualizerType = this.addVisualizerOptions[1];

    addEmitterOptions: EmitterType[] = Object.values(EmitterType);
    selectedAddEmitter: EmitterType = this.addEmitterOptions[0];

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

    onAddVisualizerClicked(): void {
        if (this.selectedAddVisualizer) {
            console.log(this.selectedAddVisualizer)
            const visualizer: IVisualizerConfig = this.visualizerService.getDefaultVisualizer(this.selectedAddVisualizer)
            this.visualizerService.addVisualizer(visualizer, true)
        }
    }

    onAddEmitterClicked(): void {
        if (this.selectedAddEmitter) {
            this.visualizerService.addEmitter(this.selectedAddEmitter)
        }
    }

    onVisualizerChange(event: MouseEvent, config: IVisualizerConfig | null): void {
        this.visualizerService.activeVisualizer = config;
        event.stopPropagation();
    }

    onEmitterChange(event: MouseEvent, config: IEmitterConfig): void {
        this.visualizerService.activeEmitter = this.visualizerService.activeEmitter === config ? null : config;
        event.stopPropagation();
    }

    onRemoveVisualizer(): void {
        this.visualizerService.removeVisualizer()
    }

    onRemoveEmitter(): void {
        this.visualizerService.removeEmitter()
    }

    onDecibelChanged(): void {
        this.audioService.setDecibelRange(this.decibelRange[0], this.decibelRange[1])
    }
}
