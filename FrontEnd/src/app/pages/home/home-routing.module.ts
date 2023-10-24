import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { CambiosComponent } from './components/cambios/cambios.component';
import { MonitoreoComponent } from './components/monitoreo/monitoreo.component';

const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        children: [
            { path: '', component: CambiosComponent },
            { path: 'monitoreo', component: MonitoreoComponent }
        ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }