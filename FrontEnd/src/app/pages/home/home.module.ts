import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from 'src/app/material/material.module';
import { HomeRoutingModule } from './home-routing.module';
import { CambiosComponent } from './components/cambios/cambios.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AbmCambiosComponent } from './components/abm-cambios/abm-cambios.component';
import { ReactiveFormsModule } from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination';

@NgModule({
    declarations: [
        CambiosComponent,
        AbmCambiosComponent
    ],
    imports: [
        CommonModule,
        MaterialModule,
        ReactiveFormsModule,
        HomeRoutingModule,
        SharedModule,
        NgxPaginationModule
    ],
    exports: [
    ]
  })
  export class HomeModule { }