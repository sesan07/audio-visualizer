import { Injectable, NgZone } from '@angular/core';
import { AnalyserMode, IOomph } from './audio.source.service.types';
import { DomSanitizer } from '@angular/platform-browser';
import { BaseSourceService } from './base.source.service';
import { ISource } from './base.source.service.types';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable({
    providedIn: 'root'
})
export class AudioSourceService extends BaseSourceService {

    sources: ISource[] = [
        { name: 'Star Eater', src: 'assets/audio/star_eater.mp3' },
        { name: 'Don\'t Stop Me Now', src: 'assets/audio/dont_stop_me_now.mp3' },
        { name: 'Dance Till Dead', src: 'assets/audio/dance_till_dead.mp3' },
        { name: 'Takin\' It Back', src: 'assets/audio/takin_it_back.mp3' },
        { name: 'Happy Troll', src: 'assets/audio/happy_troll.mp3' },
        { name: 'Epic Sax Guy', src: 'assets/audio/epic_sax_guy.mp3' },
        { name: 'Shooting Stars', src: 'assets/audio/shooting_stars.mp3' },
        { name: 'What Is Love', src: 'assets/audio/what_is_love.mp3' },
        { name: 'Bohemian Rhapsody', src: 'assets/audio/bohemian_rhapsody.mp3' },
        { name: 'Fireflies', src: 'assets/audio/fireflies.mp3' },
        { name: 'Never Gonna', src: 'assets/audio/never_gonna.mp3' },
        { name: 'Astronomia', src: 'assets/audio/astronomia.mp3' },
        { name: 'Seventh Element', src: 'assets/audio/seventh_element.mp3' },
        { name: 'Eye Of The Tiger', src: 'assets/audio/eye_of_the_tiger.mp3' },
        { name: 'Mas Queso', src: 'assets/audio/mas_queso.mp3' },
        { name: 'Darude Sandstorm', src: 'assets/audio/darude_sandstorm.mp3' }
    ];

    mode: AnalyserMode = 'frequency';
    oomph: IOomph;

    protected _idPrefix = 'audio';

    private _audioContext: AudioContext = new AudioContext();
    private _audioElement: HTMLAudioElement;
    private _sourceNode: MediaElementAudioSourceNode;
    private _analyserNodeMap: Map<number, AnalyserNode> = new Map();
    private _amplitudesMap: Map<number, Uint8Array> = new Map();
    private _sampleCounts: number[] = [8, 16, 32, 64, 128, 256, 512];
    private _oomphAmplitudes: Uint8Array;
    private _maxOomphAmplitudeTotal: number;
    private readonly _showLowerData: boolean = false;
    private readonly _smoothingTimeConstant: number = 0.7;

    constructor(private _ngZone: NgZone, sanitizer: DomSanitizer, messageService: NzMessageService) {
        super(sanitizer, messageService);
        this.sources.forEach(source => source.id = `${this._idPrefix}-${this._currIdIndex++}`)
        this.setUpAmplitudes();
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
        const currIndex: number = this.sources.indexOf(this.activeSource);
        if (currIndex - 1 >= 0) {
            this.setActiveSource(this.sources[currIndex - 1])
            setTimeout(() => this.play());
        }
    }

    playNextSong(): void {
        const currIndex: number = this.sources.indexOf(this.activeSource);
        if (currIndex + 1 < this.sources.length) {
            this.setActiveSource(this.sources[currIndex + 1])
            setTimeout(() => this.play());
        }
    }

    setDecibelRange(min: number, max: number): void {
        if (min >= max) {
            return;
        }

        this._analyserNodeMap.forEach(node => {
            // Set min max in acceptable order to prevent error
            if (max <= node.minDecibels) {
                node.minDecibels = min;
                node.maxDecibels = max;
            } else  {
                node.maxDecibels = max;
                node.minDecibels = min;
            }
        })
    }

    setUpAmplitudes(): void {
        this._sampleCounts.forEach(sampleCount => {
            this._amplitudesMap.set(sampleCount, new Uint8Array(sampleCount))
        })

        this._oomphAmplitudes = this._amplitudesMap.get(this._sampleCounts[1]);
        this._maxOomphAmplitudeTotal = this._oomphAmplitudes.length * 255
        this.oomph = { value: 0 }
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

            const total: number = this._oomphAmplitudes.reduce((prev, curr) => prev + curr);
            this.oomph.value = total / this._maxOomphAmplitudeTotal;

            requestAnimationFrame(() => this._updateAmplitudes())
        })
    }
}
