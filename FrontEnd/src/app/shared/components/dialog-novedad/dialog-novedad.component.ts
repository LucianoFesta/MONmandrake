import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Novedad } from 'src/app/interfaces/novedad';
import { DbService } from 'src/app/services/db-service.service';

@Component({
  selector: 'app-dialog-novedad',
  templateUrl: './dialog-novedad.component.html',
  styleUrls: ['./dialog-novedad.component.css']
})
export class DialogNovedadComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Novedad,
    public router:Router,
    public dialog: MatDialog,
    public dbService:DbService
  ){}

  public novedad:Novedad = this.data;

  editNovedad(id:string){
    this.router.navigateByUrl(`home/cambios/${id}`);

    this.dialog.closeAll();
  }

  eliminarNovedad(id:string){
    this.dbService.deleteNovedad(id).subscribe(() => {
      this.dialog.closeAll();
      
      location.reload();
    });
  }

}
