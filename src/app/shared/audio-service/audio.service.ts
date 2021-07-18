import { Injectable, NgZone } from '@angular/core';
import { IAudioConfig, AnalyserMode } from './audio.service.types';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AudioService {
    audioConfigs: IAudioConfig[] = [
        {
            src: 'assets/audio/dont_stop_me_now.mp3',
            isAsset: true
        },
        {
            src: 'assets/audio/dance_till_dead.mp3',
            isAsset: true
        },
        {
            src: 'assets/audio/takin_it_back.mp3',
            isAsset: true,
        },
        {
            src: 'assets/audio/happy_troll.mp3',
            isAsset: true
        },
        {
            src: 'assets/audio/epic_sax_guy.mp3',
            isAsset: true
        },
        {
            src: 'assets/audio/shooting_stars.mp3',
            isAsset: true
        },
        {
            src: 'assets/audio/what_is_love.mp3',
            isAsset: true
        },
        {
            src: 'assets/audio/bohemian_rhapsody.mp3',
            isAsset: true
        },
        {
            src: 'assets/audio/fireflies.mp3',
            isAsset: true
        },
        {
            src: 'assets/audio/never_gonna.mp3',
            isAsset: true
        },
        {
            src: 'assets/audio/astronomia.mp3',
            isAsset: true
        },
        {
            src: 'assets/audio/seventh_element.mp3',
            isAsset: true
        },
        {
            src: 'assets/audio/eye_of_the_tiger.mp3',
            isAsset: true
        },
        {
            src: 'assets/audio/mas_queso.mp3',
            isAsset: true
        },
        {
            src: 'assets/audio/darude_sandstorm.mp3',
            isAsset: true
        }
    ];
    get activeSrc(): string | SafeUrl {
        return this._activeConfig?.src;
    }
    get activeConfigChange$(): Observable<IAudioConfig> {
        return this._activeConfigSubject$.asObservable();
    }

    mode: AnalyserMode = 'frequency';

    private _activeConfig: IAudioConfig;
    private _activeConfigSubject$: Subject<IAudioConfig> = new Subject();
    private _audioContext: AudioContext = new AudioContext();
    private _audioElement: HTMLAudioElement;
    private _sourceNode: MediaElementAudioSourceNode;
    private _analyserNodeMap: Map<number, AnalyserNode> = new Map(); // todo compare performance with Object maybe?
    private _amplitudesMap: Map<number, Uint8Array> = new Map();
    private _sampleCounts: number[] = [8, 16, 32, 64, 128, 256, 512];
    private readonly _showLowerData: boolean = false;
    private readonly _smoothingTimeConstant: number = 0.7;

    constructor(private _ngZone: NgZone, private _sanitizer: DomSanitizer) {
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
        const currIndex: number = this.audioConfigs.indexOf(this._activeConfig);
        if (currIndex - 1 >= 0) {
            this.setActiveConfig(this.audioConfigs[currIndex - 1])
            setTimeout(() => this.play());
        }
    }

    playNextSong(): void {
        const currIndex: number = this.audioConfigs.indexOf(this._activeConfig);
        if (currIndex + 1 < this.audioConfigs.length) {
            this.setActiveConfig(this.audioConfigs[currIndex + 1])
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

    uploadAudioFiles (files: FileList): boolean {
        let addedNewFiles: boolean = false;
        const existingFileNames: string[] = this.audioConfigs.map(config => config.file?.name).filter(name => !!name)
        Array.from(files).forEach(file => {
            // Check if file already exists
            const index: number = existingFileNames.indexOf(file.name);
            if (index < 0) {
                this.audioConfigs.push({
                    file,
                    isAsset: false
                })
                addedNewFiles = true;
            }
        })

        return addedNewFiles;
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

    setActiveConfig(config: IAudioConfig) {
        if (!this._activeConfig?.isAsset && !!this._activeConfig?.objectUrl) {
            URL.revokeObjectURL(this._activeConfig.objectUrl)
        }

        this._activeConfig = config;
        if (!this._activeConfig.isAsset && !!this._activeConfig.file) {
            this._activeConfig.objectUrl = URL.createObjectURL(this._activeConfig.file);
            this._activeConfig.src = this._sanitizer.bypassSecurityTrustUrl(this._activeConfig.objectUrl);
        }

        this._activeConfigSubject$.next(this._activeConfig)
    }
}
