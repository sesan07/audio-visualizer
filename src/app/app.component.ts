import { AsyncPipe, NgFor, NgIf, NgStyle } from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    HostListener,
    Renderer2,
    ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { BehaviorSubject, Subject } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';

import { BackgroundCanvasComponent } from './canvas/background-canvas/background-canvas.component';
import { EntityCanvasComponent } from './canvas/entity-canvas/entity-canvas.component';
import { BarContentService } from './entity-content/bar/bar.content.service';
import { BarcleContentService } from './entity-content/barcle/barcle.content.service';
import { CircleContentService } from './entity-content/circle/circle.content.service';
import { ImageContentService } from './entity-content/image/image.content.service';
import { EntityEditComponent } from './entity-edit/entity-edit.component';
import { EntityListComponent } from './entity-list/entity-list.component';
import { EntityService } from './entity-service/entity.service';
import { GeneralOptionsComponent } from './general-options/general-options.component';
import { PresetService } from './preset-service/preset.service';
import { SongControllerComponent } from './shared-components/song-controller/song-controller.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AudioSourceService } from './source-services/audio.source.service';
import { BackgroundImageSourceService } from './source-services/background-image.source.service';
import { Source } from './source-services/base.source.service.types';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        AsyncPipe,
        NgIf,
        NgFor,
        NgStyle,
        FormsModule,
        EntityCanvasComponent,
        SidebarComponent,
        SongControllerComponent,
        EntityListComponent,
        EntityEditComponent,
        BackgroundCanvasComponent,
        GeneralOptionsComponent,
        NzButtonModule,
        NzIconModule,
    ],
})
export class AppComponent implements AfterViewInit {
    @ViewChild('audio') audioElement!: ElementRef<HTMLAudioElement>;
    @ViewChild('entityView') entityViewElement!: ElementRef<HTMLElement>;
    @ViewChild('toggleButton', { read: ElementRef }) toggleButton!: ElementRef<HTMLButtonElement>;

    readonly CONTROL_VIEW_WIDTH: number = 600;

    isControlViewOpen: boolean = true;
    entityViewScale: number = 1;
    isViewToggleVisible$: BehaviorSubject<boolean> = new BehaviorSubject(true);
    isSongControllerVisible$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    currControlViewWidth: number = this.CONTROL_VIEW_WIDTH;

    private _viewUIUpdate$: Subject<void> = new Subject();
    private _isMouseInside: boolean = false;

    constructor(
        public audioService: AudioSourceService,
        public backgroundImageService: BackgroundImageSourceService,
        public entityService: EntityService,
        public presetService: PresetService,
        private _barContentService: BarContentService,
        private _barcleContentService: BarcleContentService,
        private _circleContentService: CircleContentService,
        private _imageContentService: ImageContentService,
        private _renderer: Renderer2
    ) {
        this._viewUIUpdate$
            .pipe(
                tap(() => {
                    this.isViewToggleVisible$.next(true);
                    this.isSongControllerVisible$.next(!this.isControlViewOpen);
                }),
                debounceTime(2000)
            )
            .subscribe(() => {
                this.isViewToggleVisible$.next(this.isControlViewOpen || this._isMouseInside);
                this.isSongControllerVisible$.next(!this.isControlViewOpen && this._isMouseInside);
            });
    }

    ngAfterViewInit(): void {
        this.audioService.setUp(this.audioElement.nativeElement);

        this._barContentService.setEntityView(this.entityViewElement.nativeElement);
        this._barcleContentService.setEntityView(this.entityViewElement.nativeElement);
        this._circleContentService.setEntityView(this.entityViewElement.nativeElement);
        this._imageContentService.setEntityView(this.entityViewElement.nativeElement);

        setTimeout(() => {
            this.presetService.setActivePreset();
        });

        this._updateEntityViewScale();
    }

    @HostListener('mousemove')
    onMouseMove(): void {
        this._viewUIUpdate$.next();
    }

    @HostListener('window:keydown.space', ['$event'])
    onSpaceKeyDown(event: KeyboardEvent): void {
        if (this.isControlViewOpen) {
            return;
        }
        this.audioService.togglePlay();
        event.preventDefault();
    }

    @HostListener('window:resize')
    onWindowResize(): void {
        this._updateEntityViewScale();
    }

    formatTime(seconds: number): string {
        seconds = isNaN(seconds) ? 0 : seconds;
        const hasHours: boolean = Math.floor(seconds / 3600) > 0;
        return new Date(1000 * seconds).toISOString().substr(hasHours ? 11 : 14, hasHours ? 8 : 5);
    }

    onEntityViewClicked(): void {
        this.entityService.setActiveEntity(null);
    }

    onSongSelected(source: Source): void {
        this.audioService.setActiveSource(source, true);
        setTimeout(() => this.audioService.play());
    }

    onToggleView(): void {
        this.isControlViewOpen = !this.isControlViewOpen;

        this.currControlViewWidth = this.isControlViewOpen ? this.CONTROL_VIEW_WIDTH : 0;
        this._updateEntityViewScale();
        this.toggleButton.nativeElement.blur();

        this._viewUIUpdate$.next();
    }

    onMouseEnter(): void {
        this._isMouseInside = true;
        this._viewUIUpdate$.next();
    }

    onMouseLeave(): void {
        this._isMouseInside = false;
        this._viewUIUpdate$.next();
    }

    private _updateEntityViewScale(): void {
        const entityViewWidth: number = this.entityViewElement.nativeElement.clientWidth;
        this.entityViewScale = (entityViewWidth - this.currControlViewWidth) / entityViewWidth;
        this._renderer.setStyle(this.entityViewElement.nativeElement, 'transform', `scale(${this.entityViewScale})`);
    }
}
