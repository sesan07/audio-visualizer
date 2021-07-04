import { Injectable } from '@angular/core';
import { IAudioConfig } from 'visualizer';

@Injectable({
    providedIn: 'root'
})
export class AudioService {

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
    selectedAudioConfig: IAudioConfig = this.audioConfigs[5];

    private _audioContext: AudioContext = new AudioContext();
    private _audioElement: HTMLAudioElement;
    private _sourceNode: MediaElementAudioSourceNode;

    getAnalyser(): AnalyserNode {
        const analyserNode = this._audioContext.createAnalyser();
        this._sourceNode.connect(analyserNode);

        return analyserNode;
    }

    play(): void {
        if (this._audioContext.state !== 'running') {
            this._audioContext.resume()
                .then(() => {
                    this._audioElement.play();
                })
        } else {
            this._audioElement.play();
        }
    }

    pause(): void {
        this._audioElement.pause();
    }

    playNextSong(): void {
        const currIndex: number = this.audioConfigs.indexOf(this.selectedAudioConfig);
        if (currIndex + 1 < this.audioConfigs.length) {
            this.selectedAudioConfig = this.audioConfigs[currIndex + 1];
            setTimeout(() => this.play());
        }
    }

    playPreviousSong(): void {
        const currIndex: number = this.audioConfigs.indexOf(this.selectedAudioConfig);
        if (currIndex - 1 >= 0) {
            this.selectedAudioConfig = this.audioConfigs[currIndex - 1];
            setTimeout(() => this.play());
        }
    }

    setUp(audioElement: HTMLAudioElement): void {
        this._audioElement = audioElement;
        this._sourceNode = this._audioContext.createMediaElementSource(audioElement);
        this._sourceNode.connect(this._audioContext.destination);
    }
}
