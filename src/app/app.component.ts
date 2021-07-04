import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { IVisualizerConfig, VisualizerType } from './visualizer/visualizer.types';
import { animations } from './shared/animations';
import { AudioService } from './services/audio.service';
import { VisualizerService } from './services/visualizer.service';

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

    get isPlaying(): boolean {
        return this.audioElement ? !this.audioElement.nativeElement.paused : false;
    }

    constructor(public audioService: AudioService, public visualizerService: VisualizerService) {
    }

    ngAfterViewInit(): void {
        this.audioService.setUp(this.audioElement.nativeElement)
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

    onAddClicked(): void {
        if (this.selectedAddVisualizer) {
            this.visualizerService.addVisualizer(this.selectedAddVisualizer)
        }
    }

    onVisualizerChange(event: MouseEvent, config: IVisualizerConfig | null): void {
        this.visualizerService.activeVisualizer = config;
        event.stopPropagation();
    }

    onRemoveVisualizer(): void {
        this.visualizerService.removeVisualizer()
        // this.visualizerService.activeVisualizer = null;
    }
}
