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
import { BarcleControllerComponent } from './controllers/barcle-controller/barcle-controller.component';
import { CircleControllerComponent } from './controllers/circle-controller/circle-controller.component';
import { VisualizerComponent } from './visualizer/visualizer.component';
import { BarControllerComponent } from './controllers/bar-controller/bar-controller.component';

@NgModule({
    declarations: [
        AppComponent,
        VisualizerComponent,
        BarControllerComponent,
        BarcleControllerComponent,
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
        RippleModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
