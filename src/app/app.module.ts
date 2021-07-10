// Angular modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

// Local Modules
import { VisualizerModule } from 'visualizer';

// NGX-Color Modules
import { ColorSketchModule } from 'ngx-color/sketch';

// Local Components
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VisualizerComponent } from './visualizer-view/visualizer/visualizer.component';
import { VisualizerControllerComponent } from './control-view/visualizer-controller/visualizer-controller.component';
import { ControlComponent } from './control-view/control/control.component';
import { VisualizerEmitterComponent } from './visualizer-view/visualizer-emitter/visualizer-emitter.component';
import { EmitterControllerComponent } from './control-view/emitter-controller/emitter-controller.component';
import { ControllerWrapperComponent } from './control-view/controller-wrapper/controller-wrapper.component';
import { ColorPickerComponent } from './control-view/color-picker/color-picker.component';

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

registerLocaleData(en);  // NG-Zorro

@NgModule({
    declarations: [
        AppComponent,
        VisualizerComponent,
        VisualizerControllerComponent,
        ControlComponent,
        VisualizerEmitterComponent,
        EmitterControllerComponent,
        ControllerWrapperComponent,
        ColorPickerComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        VisualizerModule,
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
    ],
    providers: [{ provide: NZ_I18N, useValue: en_US }],
    bootstrap: [AppComponent]
})
export class AppModule {
}
