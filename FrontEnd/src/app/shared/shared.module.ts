import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from '../material/material.module';
import { DialogNovedadComponent } from './components/dialog-novedad/dialog-novedad.component';
import { LoaderComponent } from './components/loader/loader.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormNovedadComponent } from './components/form-novedad/form-novedad.component';

@NgModule({
    declarations: [
        DialogNovedadComponent,
        LoaderComponent,
        FormNovedadComponent
    ],
    imports: [
        CommonModule,
        MaterialModule,
        ReactiveFormsModule
    ],
    exports: [
        LoaderComponent,
        FormNovedadComponent
    ]
  })
  export class SharedModule { }