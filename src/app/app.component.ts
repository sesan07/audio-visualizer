import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CircleEffect, IAudioConfig, VisualizerBarOrientation, VisualizerMode, VisualizerService } from 'visualizer';
import { IVisualizerConfig } from './app.types';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
    audioConfigs: IAudioConfig[] = [
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

    audioConfig: IAudioConfig = this.audioConfigs[0];
    mode: VisualizerMode = 'frequency';
    scale: number = 0.2;
    minDecibels: number = -100;
    maxDecibels: number = -30;
    looseCaps: boolean = false;
    showLowerData: boolean = false;
    oomph: number = 1.3;
    barCapSize: number = 5;
    sampleCount: number = 64;
    sampleRadius: number = 25;
    barSpacing: number = 2;
    barSize: number = 20;
    barColor: string = '#d62828';
    barCapColor: string = '#ffb703';
    barOrientation: VisualizerBarOrientation = 'horizontal';
    startColorHex: string = '#00b4d8';
    endColorHex: string = '#ffb703';
    baseRadius: number = 80;
    circleEffect: CircleEffect = CircleEffect.DEFAULT;

    selectedAddOption: string = 'Barcle';

    activeVisualizerConfig: IVisualizerConfig = null;

    decibelRange: [number, number] = [-80, -20]
    sampleCountOptions: number[] = [8, 16, 32, 64, 128, 256, 512]
    modeOptions: object[] = [
        {
            name: 'Frequency',
            value: 'frequency'
        },
        {
            name: 'Time Domain',
            value: 'timeDomain'
        },
    ]
    addOptions: string[] = ['Bar', 'Barcle', 'Circle']

    visualizerConfigs: IVisualizerConfig[] = [];

    @ViewChild('audioElement') audioElement: ElementRef<HTMLAudioElement>;

    constructor(public visualizerService: VisualizerService) {
    }

    ngAfterViewInit(): void {
        this.visualizerService.audioElement = this.audioElement.nativeElement;
        this.visualizerService.sampleCount = this.sampleCount;
        this.visualizerService.setMinMax(this.decibelRange[0], this.decibelRange[1]);
        this.visualizerService.mode = this.mode;
        this.visualizerService.start();
    }

    onPlay(): void {
        this._play();
    }

    onPause(): void {
        this.audioElement.nativeElement.pause();
    }

    onEnded(): void {
        console.log('song is kill');
    }

    private _play(): void {
        this.audioElement.nativeElement.play().catch(error => console.error('Unable to play audio.', error));
    }

    onDecibelChanged() {
        this.visualizerService.setMinMax(this.decibelRange[0], this.decibelRange[1]);
    }

    onSampleCountChanged() {
        this.visualizerService.sampleCount = this.sampleCount;
    }

    onModeChanged() {
        this.visualizerService.mode = this.mode;
    }

    onAddClicked() {
        if (!this.selectedAddOption) {
            return;
        }

        switch (this.selectedAddOption) {
            case 'Bar':
                break;
            case 'Barcle':
                this.visualizerConfigs.push({
                    type: 'Barcle',
                    audioConfig: this.audioConfig,
                    baseRadius: this.baseRadius,
                    startColorHex: this.startColorHex,
                    endColorHex: this.endColorHex,
                    oomph: this.oomph,
                    scale: this.scale,
                })
                break;
            case 'Circle':
                this.visualizerConfigs.push({
                    type: 'Circle',
                    audioConfig: this.audioConfig,
                    startColorHex: this.startColorHex,
                    endColorHex: this.endColorHex,
                    oomph: this.oomph,
                    scale: this.scale,
                    baseRadius: this.baseRadius,
                    sampleRadius: this.sampleRadius,
                    effect: this.circleEffect
                })
                break;
            default:
                console.error('Unknown visualizer option selected')
        }
    }

    onVisualizerClicked(config: IVisualizerConfig) {
        this.activeVisualizerConfig = config;
    }

    onRemoveVisualizer() {
        const index: number = this.visualizerConfigs.indexOf(this.activeVisualizerConfig)
        if (index !== -1) {
            this.visualizerConfigs.splice(index, 1)
            this.activeVisualizerConfig = null;
        }
    }
}
