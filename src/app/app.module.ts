import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { VisualizerModule } from 'visualizer';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VisualizerComponent } from './visualizer/visualizer.component';
import { VisualizerControllerComponent } from './visualizer-controller/visualizer-controller.component';
import { ControlComponent } from './shared/control/control.component';
import { VisualizerEmitterComponent } from './visualizer-emitter/visualizer-emitter.component';
import { EmitterControllerComponent } from './emitter-controller/emitter-controller.component';
import { ControllerWrapperComponent } from './controller-wrapper/controller-wrapper.component';

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
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        VisualizerModule,
        FormsModule,
        HttpClientModule,
        NzButtonModule,
        NzDropDownModule,
        NzIconModule,
        NzRadioModule,
        NzSliderModule,
        NzDividerModule,
        NzSwitchModule,
    ],
    providers: [{ provide: NZ_I18N, useValue: en_US }],
    bootstrap: [AppComponent]
})
export class AppModule {
}
