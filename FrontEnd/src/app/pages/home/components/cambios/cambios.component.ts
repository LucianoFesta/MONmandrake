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

  public listNovedades: { [mes: string]: Novedad[] } = {};

  public filteredNovedades: { [mes: string]: Novedad[] } = {};

  public sorted:string[] = []

  public valoresColores: { [valor: string]: string } = {
    "Abacom": '#f73b3b',
    "Web": '#02a71d',
    "Jboss": '#605fb4',
    "Autorizador": '#e4be40',
    "Pepito": '#e4be40',
    "SQL": '#g4ae50',
    "MongoDB": '#f4be90',
    "Openshift": '#f4be50',
    "Servidor": '#a4be40',
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
  
      novedades.sort((a,b) =>{
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      })
  
      novedades.forEach((novedad:Novedad) => {
        const fecha = new Date(novedad.created_at);
        const mes = fecha.toLocaleString('es-ES',{month:'long'});
        const anio = fecha.getFullYear();
        const key = `${mes}-${anio}`;
        
        if(!this.listNovedades[key]){
          this.listNovedades[key] = [];
        }
        this.listNovedades[key].push(novedad);
      })

      this.filteredNovedades = this.listNovedades;
  
      this.sorted = Object.keys(this.listNovedades).sort((a, b) => {
        const fechaA = new Date(a.split('-')[1]);
        const fechaB = new Date(b.split('-')[1]);
        return fechaB.getTime() - fechaA.getTime();
      });
    })
  }
  
  isEmpty(obj: object): boolean {
    return Object.keys(obj).length === 0;
  }  

  openDialog(item:Novedad){
    this.dialog.open(DialogNovedadComponent,{
      data: item
    });
  }

  searchNovedades() {
    const newTag = this.searchInput.nativeElement.value.toLowerCase();
  
    if (newTag) {
      this.filteredNovedades = {};

      for (let mes in this.listNovedades) {
        let filteredNovedades = this.listNovedades[mes].filter(novedad => {
          return novedad.etiquetas.some(tag => tag.toLowerCase().includes(newTag));
        });
        if (filteredNovedades.length > 0) {
          this.filteredNovedades[mes] = filteredNovedades;
        }
      }

      this.sorted = Object.keys(this.filteredNovedades).sort((a, b) => {
        const fechaA = new Date(a.split('-')[1]);
        const fechaB = new Date(b.split('-')[1]);
        return fechaB.getTime() - fechaA.getTime();
      });
    }
  }
  
  
  
  
}
