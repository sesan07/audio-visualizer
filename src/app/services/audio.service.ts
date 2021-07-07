import { Injectable, NgZone } from '@angular/core';
import { IAudioConfig, VisualizerMode } from 'visualizer';

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

    mode: VisualizerMode = 'frequency';

    private _audioContext: AudioContext = new AudioContext();
    private _audioElement: HTMLAudioElement;
    private _sourceNode: MediaElementAudioSourceNode;
    private _analyserNodeMap: Map<number, AnalyserNode> = new Map(); // todo compare performance with Object maybe?
    private _amplitudesMap: Map<number, Uint8Array> = new Map();
    private _sampleCounts: number[] = [8, 16, 32, 64, 128, 256, 512];
    private readonly _showLowerData: boolean = false;
    private readonly _smoothingTimeConstant: number = 0.7;

    constructor(private _ngZone: NgZone) {
    }

    get sampleCounts(): number[] {
        return this._sampleCounts.slice();
    }

    getAmplitudes(sampleCount: number): Uint8Array {
        return this._amplitudesMap.get(sampleCount);
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

    playPreviousSong(): void {
        const currIndex: number = this.audioConfigs.indexOf(this.selectedAudioConfig);
        if (currIndex - 1 >= 0) {
            this.selectedAudioConfig = this.audioConfigs[currIndex - 1];
            setTimeout(() => this.play());
        }
    }

    playNextSong(): void {
        const currIndex: number = this.audioConfigs.indexOf(this.selectedAudioConfig);
        if (currIndex + 1 < this.audioConfigs.length) {
            this.selectedAudioConfig = this.audioConfigs[currIndex + 1];
            setTimeout(() => this.play());
        }
    }

    setDecibelRange(min: number, max: number): void {
        this._analyserNodeMap.forEach(node => {
            node.minDecibels = min;
            node.maxDecibels = max;
        })
    }

    setUp(audioElement: HTMLAudioElement): void {
        this._audioElement = audioElement;
        this._sourceNode = this._audioContext.createMediaElementSource(audioElement);
        this._sourceNode.connect(this._audioContext.destination);

        this._sampleCounts.forEach(sampleCount => {
            const node: AnalyserNode = this._audioContext.createAnalyser();
            this._sourceNode.connect(node);

            node.fftSize = sampleCount * (this._showLowerData ? 2 : 4);
            node.smoothingTimeConstant = this._smoothingTimeConstant;

            this._analyserNodeMap.set(sampleCount, node)
            this._amplitudesMap.set(sampleCount, new Uint8Array(sampleCount))
        })

        this._updateAmplitudes();
    }

    private _updateAmplitudes(): void {
        this._ngZone.runOutsideAngular(() => {
            this._amplitudesMap.forEach((amplitudes, sampleCount) => {
                const node: AnalyserNode = this._analyserNodeMap.get(sampleCount)
                if (this.mode === 'frequency') {
                    node.getByteFrequencyData(amplitudes);
                } else {
                    node.getByteTimeDomainData(amplitudes);
                }
            })

            requestAnimationFrame(() => this._updateAmplitudes())
        })
    }
}
