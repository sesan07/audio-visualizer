// Angular modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

// NGX-Color Modules
import { ColorSketchModule } from 'ngx-color/sketch';

// Local Components
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EntityComponent } from './entity/entity.component';
import { EntityControllerComponent } from './entity-controller/entity-controller.component';
import { ControlLineComponent } from './shared/components/control-line/control-line.component';
import { EntityEmitterComponent } from './entity-emitter/entity-emitter.component';
import { EntityEmitterControllerComponent } from './entity-emitter-controller/entity-emitter-controller.component';
import { ControllerWrapperComponent } from './shared/components/controller-wrapper/controller-wrapper.component';
import { ColorPickerComponent } from './shared/components/color-picker/color-picker.component';
import { VisualizerControllerComponent } from './entity-controller/visualizer-controller/visualizer-controller.component';
import { VisualizerEntityComponent } from './entity/visualizer-entity/visualizer-entity.component';
import { BarVisualizerComponent } from './entity/visualizer-entity/bar-visualizer/bar-visualizer.component';
import { CircleVisualizerComponent } from './entity/visualizer-entity/circle-visualizer/circle-visualizer.component';
import { BarcleVisualizerComponent } from './entity/visualizer-entity/barcle-visualizer/barcle-visualizer.component';
import { ImageEntityComponent } from './entity/image-entity/image-entity.component';
import { ImageControllerComponent } from './entity-controller/image-controller/image-controller.component';

// NG-Zorro Base
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { HttpClientModule } from '@angular/common/http';

// NG-Zorro Component Modules
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzInputModule } from 'ng-zorro-antd/input';

registerLocaleData(en);  // NG-Zorro

@NgModule({
    declarations: [
        AppComponent,
        EntityComponent,
        EntityControllerComponent,
        ControlLineComponent,
        EntityEmitterComponent,
        EntityEmitterControllerComponent,
        ControllerWrapperComponent,
        ColorPickerComponent,
        VisualizerControllerComponent,
        VisualizerEntityComponent,
        BarVisualizerComponent,
        CircleVisualizerComponent,
        BarcleVisualizerComponent,
        ImageEntityComponent,
        ImageControllerComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpClientModule,
        ColorSketchModule,
        NzButtonModule,
        NzDropDownModule,
        NzIconModule,
        NzRadioModule,
        NzSliderModule,
        NzDividerModule,
        NzSwitchModule,
        NzInputNumberModule,
        NzPopoverModule,
        NzSelectModule,
        NzUploadModule,
        NzCollapseModule,
        NzInputModule,
    ],
    providers: [{ provide: NZ_I18N, useValue: en_US }, NzMessageService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
