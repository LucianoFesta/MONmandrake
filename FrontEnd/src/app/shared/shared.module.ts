import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from '../material/material.module';
import { DialogNovedadComponent } from './components/dialog-novedad/dialog-novedad.component';

@NgModule({
    declarations: [
        DialogNovedadComponent
    ],
    imports: [
        CommonModule,
        MaterialModule,
    ],
    exports: []
  })
  export class SharedModule { }