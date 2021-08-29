import { AfterViewInit, Component, ElementRef, HostListener, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { EntityType } from './entity/entity.types';
import { animations } from './shared/animations';
import { AudioSourceService } from './shared/source-services/audio.source.service';
import { EntityService } from './entity/entity.service';
import { EmitterType } from './emitter/emitter.types';
import { EmitterService } from './emitter/emitter.service';
import { BackgroundImageSourceService } from './shared/source-services/background-image.source.service';
import { PresetService } from './shared/preset-service/preset.service';
import { ImageSourceService } from './shared/source-services/image.source.service';
import { BarContentService } from './entity-content/bar/bar.content.service';
import { BarcleContentService } from './entity-content/barcle/barcle.content.service';
import { CircleContentService } from './entity-content/circle/circle.content.service';
import { ImageContentService } from './entity-content/image/image.content.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    animations: animations
})
export class AppComponent implements OnInit, AfterViewInit {
    @ViewChild('audio') audioElement: ElementRef<HTMLAudioElement>;
    @ViewChild('audioFileInput') audioFileInputElement: ElementRef<HTMLInputElement>;
    @ViewChild('backgroundFileInput') backgroundFileInputElement: ElementRef<HTMLInputElement>;
    @ViewChild('entityView') entityView: ElementRef<HTMLElement>;
    @ViewChild('entityViewContent') entityViewContentElement: ElementRef<HTMLElement>;

    @ViewChildren('hiddenImage') hiddenImages: QueryList<ElementRef<HTMLImageElement>>;

    @HostListener('window:resize')
    onWindowResize(): void {
        this._updateEntityViewContentScale();
    }

    addEntityOptions: EntityType[] = Object.values(EntityType);
    addEmitterOptions: EmitterType[] = Object.values(EmitterType);

    backgroundOpacity: number = 0.5;
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

    isControlViewOpen: boolean = true;
    controlViewWidth: number;
    controlViewContentWidth: number;
    entityViewContentScale: number;

    savePresetPopOverVisible: boolean;

    private readonly _controlViewWidth: number = 500;

    get isPlaying(): boolean {
        return this.audioElement ? !this.audioElement.nativeElement.paused : false;
    }

    constructor(public audioService: AudioSourceService,
                public backgroundImageService: BackgroundImageSourceService,
                public entityService: EntityService,
                public emitterService: EmitterService,
                public presetService: PresetService,
                public imageService: ImageSourceService,
                private _barContentService: BarContentService,
                private _barcleContentService: BarcleContentService,
                private _circleContentService: CircleContentService,
                private _imageContentService: ImageContentService,
                private _elementRef: ElementRef<HTMLElement>,
                private _renderer: Renderer2) {
    }

    ngOnInit(): void {
        this.audioService.setActiveSource(this.audioService.sources[0]);
        this.backgroundImageService.setActiveSource(this.backgroundImageService.sources[0])

        this.controlViewWidth = this.isControlViewOpen ? this._controlViewWidth : 0;
        this.controlViewContentWidth = this._controlViewWidth;
    }

    ngAfterViewInit(): void {
        this.audioService.setUp(this.audioElement.nativeElement)
        this.audioService.setDecibelRange(this.decibelRange[0], this.decibelRange[1])

        this._barContentService.setEntityView(this.entityViewContentElement.nativeElement);
        this._barcleContentService.setEntityView(this.entityViewContentElement.nativeElement);
        this._circleContentService.setEntityView(this.entityViewContentElement.nativeElement);
        this._imageContentService.setEntityView(this.entityViewContentElement.nativeElement);

        this.imageService.setImageElements(this.hiddenImages.map(ref => ref.nativeElement));
        this.hiddenImages.changes.subscribe(() => {
            this.imageService.setImageElements(this.hiddenImages.map(ref => ref.nativeElement));
        })

        // Microsoft Edge's dimensions at AfterViewInit aren't correct, so wait a bit
        setTimeout(() => this._updateEntityViewContentScale(), 500)
    }

    onEntityViewClicked(): void {
        this.entityService.setActiveEntity(null)
        this.emitterService.activeEmitter = null;
    }

    onDecibelChanged(): void {
        this.audioService.setDecibelRange(this.decibelRange[0], this.decibelRange[1])
    }

    toggleControlView(): void {
        this.isControlViewOpen = !this.isControlViewOpen;

        this.controlViewWidth = this.isControlViewOpen ? this._controlViewWidth : 0;
        this._updateEntityViewContentScale();
    }

    private _updateEntityViewContentScale(): void {
        const entityViewWidth: number = this.entityViewContentElement.nativeElement.clientWidth;
        this.entityViewContentScale = (entityViewWidth - this.controlViewWidth) / entityViewWidth
        this._renderer.setStyle(this.entityViewContentElement.nativeElement, 'transform', `scale(${this.entityViewContentScale})`)
    }
}
