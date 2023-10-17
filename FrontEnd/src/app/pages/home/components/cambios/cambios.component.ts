import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Novedad } from 'src/app/interfaces/novedad';
import { DbService } from 'src/app/services/db-service.service';
import { DialogNovedadComponent } from 'src/app/shared/components/dialog-novedad/dialog-novedad.component';

@Component({
  selector: 'app-cambios',
  templateUrl: './cambios.component.html',
  styleUrls: ['./cambios.component.css']
})
export class CambiosComponent implements OnInit {

  public loader:boolean = false;

  public listNovedades:Novedad[] = [];

  public filteredNovedades:Novedad[] = [];

  public valoresColores: { [valor: string]: string } = {
    "Abacom": '#f73b3b',
    "Web": '#02a71d',
    "Jboss": '#605fb4',
    "Autorizador": '#e4be40',
  };
  
  constructor( 
    private dbService: DbService,
    public dialog: MatDialog
  ) {}

  @ViewChild('searchTag')
  public searchInput!: ElementRef<HTMLInputElement>;
  
  
  ngOnInit(): void {
    this.getNovedades();

    setTimeout(() => {
      this.loader = !this.loader;
    },1000)
  }

  getNovedades(){
    this.dbService.getNovedades().subscribe( novedades => {
      this.listNovedades = novedades.sort((a,b) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      })

      this.filteredNovedades = [...this.listNovedades];
    })
  }

  openDialog(item:Novedad){
    const dialog = this.dialog.open(DialogNovedadComponent,{
      data: item
    });

    dialog.afterClosed().subscribe(() => {
      this.getNovedades();
    })

  }

  searchNovedades() {
    const newTag = this.searchInput.nativeElement.value.toLowerCase();

    if (newTag) {
      this.filteredNovedades = this.listNovedades.filter(novedad => {
        return novedad.etiquetas.some(tag => tag.toLowerCase().includes(newTag));
      });

    } else {
      this.filteredNovedades = [...this.listNovedades];
    }

  }
  
}
