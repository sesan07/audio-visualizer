import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CircleEffect, IAudioConfig, VisualizerBarOrientation, VisualizerMode, VisualizerService } from 'visualizer';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
    audioConfigs: IAudioConfig[] = [
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

    activeConfig: IAudioConfig = this.audioConfigs[0];
    mode: VisualizerMode = 'frequency';
    scale: number = 0.6;
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

    @ViewChild('audioElement') audioElement: ElementRef<HTMLAudioElement>;
    @ViewChild('songs') songsElement: ElementRef<HTMLSelectElement>;

    constructor(private visualizerService: VisualizerService) {
    }

    ngAfterViewInit() {
        this.visualizerService.audioElement = this.audioElement.nativeElement;
        this.visualizerService.sampleCount = this.sampleCount;
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

    onChange(event: any) {
        this.activeConfig = this.audioConfigs[this.songsElement.nativeElement.selectedIndex];
    }
}
