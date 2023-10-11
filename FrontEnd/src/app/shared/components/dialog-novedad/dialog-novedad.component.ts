import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Novedad } from 'src/app/interfaces/novedad';

@Component({
  selector: 'app-dialog-novedad',
  templateUrl: './dialog-novedad.component.html',
  styleUrls: ['./dialog-novedad.component.css']
})
export class DialogNovedadComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: Novedad){}

  public novedad:Novedad = this.data;

}
