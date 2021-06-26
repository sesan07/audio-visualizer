import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CircleEffect, IAudioConfig, VisualizerBarOrientation, VisualizerMode, VisualizerService } from 'visualizer';
import { IVisualizerConfig, VisualizerType } from './visualizer/visualizer.types';

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
    sampleCountOptions: number[] = [8, 16, 32, 64, 128, 256, 512];

    // UI Selections
    selectedAddVisualizer: string = this.addVisualizerOptions[0];
    selectedAudioConfig: IAudioConfig = this.audioConfigOptions[0];
    selectedDecibelRange: [number, number] = [-80, -20];
    selectedMode: VisualizerMode = this.modeOptions[0].value;
    selectedSampleCount: number = this.sampleCountOptions[2];

    // Visualizers
    activeVisualizer: IVisualizerConfig;
    visualizers: IVisualizerConfig[] = [];

    // Add Visualizer Defaults
    barCapColor: string = '#ffb703';
    barCapSize: number = 5;
    barSize: number = 20;
    barSpacing: number = 2;
    barOrientation: VisualizerBarOrientation = 'horizontal';
    baseRadius: number = 80;
    circleEffect: CircleEffect = CircleEffect.DEFAULT;
    endColorHex: string = '#ffb703';
    looseCaps: boolean = false;
    oomph: number = 1.3;
    sampleRadius: number = 25;
    scale: number = 0.1;
    startColorHex: string = '#00b4d8';

    get isPlaying(): boolean {
        return this.audioElement ? !this.audioElement.nativeElement.paused : false;
    }

    constructor(public visualizerService: VisualizerService) {
    }

    ngAfterViewInit(): void {
        this.visualizerService.audioElement = this.audioElement.nativeElement;
        this.visualizerService.sampleCount = this.selectedSampleCount;
        this.visualizerService.setMinMax(this.selectedDecibelRange[0], this.selectedDecibelRange[1]);
        this.visualizerService.mode = this.selectedMode;
        this.visualizerService.start();
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

    onDecibelChanged(): void {
        this.visualizerService.setMinMax(this.selectedDecibelRange[0], this.selectedDecibelRange[1]);
    }

    onSampleCountChanged(): void {
        this.visualizerService.sampleCount = this.selectedSampleCount;
    }

    onModeChanged(): void {
        this.visualizerService.mode = this.selectedMode;
    }

    onAddClicked(): void {
        if (!this.selectedAddVisualizer) {
            return;
        }

        switch (this.selectedAddVisualizer) {
            case 'Bar':
                this.visualizers.push({
                    type: VisualizerType.BAR,
                    audioConfig: this.selectedAudioConfig,
                    startColorHex: this.startColorHex,
                    endColorHex: this.endColorHex,
                    oomph: this.oomph,
                    scale: this.scale,
                    barCapSize: this.barCapSize,
                    barCapColor: this.barCapColor,
                    barOrientation: this.barOrientation,
                    barSize: this.barSize,
                    barSpacing: this.barSpacing,
                    looseCaps: this.looseCaps
                });
                break;
            case 'Barcle':
                this.visualizers.push({
                    type: VisualizerType.BARCLE,
                    audioConfig: this.selectedAudioConfig,
                    baseRadius: this.baseRadius,
                    startColorHex: this.startColorHex,
                    endColorHex: this.endColorHex,
                    oomph: this.oomph,
                    scale: this.scale,
                });
                break;
            case 'Circle':
                this.visualizers.push({
                    type: VisualizerType.CIRCLE,
                    audioConfig: this.selectedAudioConfig,
                    startColorHex: this.startColorHex,
                    endColorHex: this.endColorHex,
                    oomph: this.oomph,
                    scale: this.scale,
                    baseRadius: this.baseRadius,
                    sampleRadius: this.sampleRadius,
                    effect: this.circleEffect
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
