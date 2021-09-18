import {
    AfterViewInit,
    Component,
    ElementRef,
    HostBinding,
    HostListener,
    OnInit,
    QueryList,
    Renderer2,
    ViewChild,
    ViewChildren
} from '@angular/core';
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
import { Source } from './shared/source-services/base.source.service.types';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: [ './app.component.scss' ],
    animations: animations
})
export class AppComponent implements OnInit, AfterViewInit {
    @ViewChild('audio') audioElement: ElementRef<HTMLAudioElement>;
    @ViewChild('audioFileInput') audioFileInputElement: ElementRef<HTMLInputElement>;
    @ViewChild('backgroundFileInput') backgroundFileInputElement: ElementRef<HTMLInputElement>;
    @ViewChild('entityView') entityViewElement: ElementRef<HTMLElement>;

    @ViewChildren('hiddenImage') hiddenImages: QueryList<ElementRef<HTMLImageElement>>;

    @HostBinding('style.cursor') cursor: string = 'auto';

    @HostListener('window:resize')
    onWindowResize(): void {
        this._updateEntityViewScale();
    }

    @HostListener('mousemove')
    onMouseMove(): void {
        const showResizeCursor: boolean = this.entityService.controllableEntities.some(entity => entity.showResizeCursor)
        const showMoveCursor: boolean = this.entityService.controllableEntities.some(entity => entity.showMoveCursor)
        this.cursor = showResizeCursor
            ? 'nwse-resize'
            : showMoveCursor
                ? 'move'
                : 'auto';

        this.toggleButtonOpacity = 1;
        this._mouseMove$.next();
    }

    addEntityOptions: EntityType[] = Object.values(EntityType);
    addEmitterOptions: EmitterType[] = Object.values(EmitterType);

    currentAudioTime: number = 0;
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
    decibelRange: [ number, number ] = [ -80, -20 ];

    toggleButtonOpacity: number = 1;
    isControlViewOpen: boolean = true;
    controlViewWidth: number;
    controlViewContentWidth: number;
    entityViewScale: number;

    savePresetPopOverVisible: boolean;

    private readonly _controlViewWidth: number = 500;
    private _mouseMove$: Subject<void> = new Subject();

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
        this.backgroundImageService.setActiveSource(this.backgroundImageService.sources[0]);

        this.controlViewWidth = this.isControlViewOpen ? this._controlViewWidth : 0;
        this.controlViewContentWidth = this._controlViewWidth;

        this._mouseMove$.pipe(debounceTime(1500)).subscribe(() => this.toggleButtonOpacity = this.isControlViewOpen ? 1 : 0)
    }

    ngAfterViewInit(): void {
        this.audioService.setUp(this.audioElement.nativeElement);
        this.audioService.setDecibelRange(this.decibelRange[0], this.decibelRange[1]);

        this._barContentService.setEntityView(this.entityViewElement.nativeElement);
        this._barcleContentService.setEntityView(this.entityViewElement.nativeElement);
        this._circleContentService.setEntityView(this.entityViewElement.nativeElement);
        this._imageContentService.setEntityView(this.entityViewElement.nativeElement);

        this.imageService.setImageElements(this.hiddenImages.map(ref => ref.nativeElement));
        this.hiddenImages.changes.subscribe(() => {
            this.imageService.setImageElements(this.hiddenImages.map(ref => ref.nativeElement));
        });

        // Microsoft Edge's dimensions at AfterViewInit aren't correct, so wait a bit
        setTimeout(() => this._updateEntityViewScale(), 500);
    }

    formatTime(seconds: number): string {
        seconds = isNaN(seconds) ? 0 : seconds;
        const hasHours: boolean = Math.floor(seconds / 3600) > 0;
        return new Date(1000 * seconds).toISOString().substr(hasHours ? 11 : 14, hasHours ? 8 : 5);
    }

    onEntityViewClicked(): void {
        this.entityService.setActiveEntity(null);
        this.emitterService.setActiveEmitter(null);
    }

    onDecibelChanged(): void {
        this.audioService.setDecibelRange(this.decibelRange[0], this.decibelRange[1]);
    }

    onSongSelected(source: Source): void {
        this.audioService.setActiveSource(source)
        setTimeout(() => this.audioService.play());
    }

    onToggleControlView(): void {
        this.isControlViewOpen = !this.isControlViewOpen;

        this.controlViewWidth = this.isControlViewOpen ? this._controlViewWidth : 0;
        this._updateEntityViewScale();
    }

    private _updateEntityViewScale(): void {
        const entityViewWidth: number = this.entityViewElement.nativeElement.clientWidth;
        this.entityViewScale = (entityViewWidth - this.controlViewWidth) / entityViewWidth;
        this._renderer.setStyle(this.entityViewElement.nativeElement, 'transform', `scale(${this.entityViewScale})`);
    }
}
