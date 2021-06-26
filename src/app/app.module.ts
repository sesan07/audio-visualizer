import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { VisualizerModule } from 'visualizer';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { SliderModule } from 'primeng/slider';
import { RippleModule } from 'primeng/ripple';
import { SelectButtonModule } from 'primeng/selectbutton';
import { VisualizerComponent } from './visualizer/visualizer.component';
import { VisualizerControllerComponent } from './visualizer-controller/visualizer-controller.component';

@NgModule({
    declarations: [
        AppComponent,
        VisualizerComponent,
        VisualizerControllerComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        VisualizerModule,
        FormsModule,
        ButtonModule,
        DropdownModule,
        SelectButtonModule,
        SliderModule,
        RippleModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
