import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { VisualizerModule } from 'visualizer';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { SliderModule } from 'primeng/slider';
import { BarcleVisualizerComponent } from './visualizers/barcle-visualizer/barcle-visualizer.component';
import { SelectButtonModule } from 'primeng/selectbutton';
import { BarcleControllerComponent } from './controllers/barcle-controller/barcle-controller.component';
import { CircleVisualizerComponent } from './visualizers/circle-visualizer/circle-visualizer.component';
import { CircleControllerComponent } from './controllers/circle-controller/circle-controller.component';

@NgModule({
    declarations: [
        AppComponent,
        BarcleVisualizerComponent,
        BarcleControllerComponent,
        CircleVisualizerComponent,
        CircleControllerComponent,
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
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
