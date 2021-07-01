import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CircleEffect, IAudioConfig } from 'visualizer';
import { IBaseVisualizerConfig, IVisualizerConfig, VisualizerType } from './visualizer/visualizer.types';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
    @ViewChild('audioElement') audioElement: ElementRef<HTMLAudioElement>;

    // UI Options
    audioConfigOptions: IAudioConfig[] = [
        {
            src: 'assets/audio/dont_stop_me_now.mp3',
            bpm: 156
        },
        {
            src: 'assets/audio/dance_till_dead.mp3',
            bpm: 155
        },
        {
            src: 'assets/audio/takin_it_back.mp3',
            bpm: 128,
        },
        {
            src: 'assets/audio/happy_troll.mp3',
            bpm: 150
        },
        {
            src: 'assets/audio/epic_sax_guy.mp3',
            bpm: 130
        },
        {
            src: 'assets/audio/shooting_stars.mp3',
            bpm: 123
        },
        {
            src: 'assets/audio/what_is_love.mp3',
            bpm: 123
        },
        {
            src: 'assets/audio/bohemian_rhapsody.mp3',
            bpm: 72
        },
        {
            src: 'assets/audio/fireflies.mp3',
            bpm: 90
        },
        {
            src: 'assets/audio/never_gonna.mp3',
            bpm: 113
        },
        {
            src: 'assets/audio/astronomia.mp3',
            bpm: 126
        },
        {
            src: 'assets/audio/seventh_element.mp3',
            bpm: 128
        },
        {
            src: 'assets/audio/eye_of_the_tiger.mp3',
            bpm: 108
        },
        {
            src: 'assets/audio/mas_queso.mp3',
            bpm: 105
        },
        {
            src: 'assets/audio/darude_sandstorm.mp3',
            bpm: 136
        }
    ];
    addVisualizerOptions: string[] = Object.values(VisualizerType);

    // UI Selections
    selectedAddVisualizer: string = this.addVisualizerOptions[0];
    selectedAudioConfig: IAudioConfig = this.audioConfigOptions[5];

    // Visualizers
    activeVisualizer: IVisualizerConfig;
    visualizers: IVisualizerConfig[] = [];

    private _audioContext: AudioContext = new AudioContext();
    private _sourceNode: MediaElementAudioSourceNode;

    get isPlaying(): boolean {
        return this.audioElement ? !this.audioElement.nativeElement.paused : false;
    }

    ngAfterViewInit(): void {
        this._sourceNode = this._audioContext.createMediaElementSource(this.audioElement.nativeElement);
        this._sourceNode.connect(this._audioContext.destination);
    }

    onPlayPause(): void {
        if (!this.isPlaying) {
            this.audioElement.nativeElement.play().catch(error => console.error('Unable to play audio.', error));
        } else {
            this.audioElement.nativeElement.pause();
        }
    }

    onNextSong(): void {
        const currIndex: number = this.audioConfigOptions.indexOf(this.selectedAudioConfig);
        if (currIndex + 1 < this.audioConfigOptions.length) {
            this.selectedAudioConfig = this.audioConfigOptions[currIndex + 1];
            setTimeout(() => this.onPlayPause());
        }
    }

    onPrevSong(): void {
        const currIndex: number = this.audioConfigOptions.indexOf(this.selectedAudioConfig);
        if (currIndex - 1 >= 0) {
            this.selectedAudioConfig = this.audioConfigOptions[currIndex - 1];
            setTimeout(() => this.onPlayPause());
        }
    }

    onEnded(): void {
        this.onNextSong();
    }

    onAddClicked(): void {
        if (!this.selectedAddVisualizer) {
            return;
        }

        const analyserNode = this._audioContext.createAnalyser();
        this._sourceNode.connect(analyserNode);

        const baseConfig: IBaseVisualizerConfig = {
            type: undefined,
            analyserNode: analyserNode,
            audioConfig: this.selectedAudioConfig,
            startColorHex: '#00b4d8',
            endColorHex: '#ffb703',
            oomph: 1.3,
            scale: 0.2,
            maxDecibels: -20,
            minDecibels: -80,
            mode: 'frequency',
            sampleCount: 16,
            showLowerData: false
        };

        switch (this.selectedAddVisualizer) {
            case 'Bar':
                this.visualizers.push({
                    ...baseConfig,
                    type: VisualizerType.BAR,
                    barCapSize: 5,
                    barCapColor: '#ffb703',
                    barOrientation: 'horizontal',
                    barSize: 20,
                    barSpacing: 2,
                    looseCaps: false
                });
                break;
            case 'Barcle':
                this.visualizers.push({
                    ...baseConfig,
                    type: VisualizerType.BARCLE,
                    baseRadius: 80,
                });
                break;
            case 'Circle':
                this.visualizers.push({
                    ...baseConfig,
                    type: VisualizerType.CIRCLE,
                    baseRadius: 80,
                    sampleRadius: 25,
                    effect: CircleEffect.DEFAULT
                });
                break;
            default:
                console.error('Unknown visualizer option selected');
        }
    }

    onVisualizerChange(event: MouseEvent, config: IVisualizerConfig | null): void {
        this.activeVisualizer = config;
        event.stopPropagation();
    }

    onRemoveVisualizer(): void {
        const index: number = this.visualizers.indexOf(this.activeVisualizer);
        if (index !== -1) {
            this.visualizers.splice(index, 1);
            this.activeVisualizer = null;
        }
    }
}
