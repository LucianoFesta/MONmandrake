import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from '../material/material.module';
import { DialogNovedadComponent } from './components/dialog-novedad/dialog-novedad.component';
import { LoaderComponent } from './components/loader/loader.component';

@NgModule({
    declarations: [
        DialogNovedadComponent,
        LoaderComponent
    ],
    imports: [
        CommonModule,
        MaterialModule,
    ],
    exports: [
        LoaderComponent
    ]
  })
  export class SharedModule { }