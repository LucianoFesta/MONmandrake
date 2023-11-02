import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { Observable, map, startWith } from 'rxjs';
import { Novedad } from 'src/app/interfaces/novedad';
import { DbService } from 'src/app/services/db-service.service';
import { DialogNovedadComponent } from 'src/app/shared/components/dialog-novedad/dialog-novedad.component';
import { MatChipInputEvent } from '@angular/material/chips';
import { LiveAnnouncer } from '@angular/cdk/a11y';

@Component({
  selector: 'app-cambios',
  templateUrl: './cambios.component.html',
  styleUrls: ['./cambios.component.css']
})
export class CambiosComponent implements OnInit {

  public loader:boolean = false;

  public searchTags:boolean = false;

  public page: number = 1;

  public listNovedades: { [mes: string]: Novedad[] } = {};

  public filteredNovedades: { [mes: string]: Novedad[] } = {};

  public sorted:string[] = []

  // public valoresColores: { [valor: string]: string } = {
  //   "Abacom": '#f73b3b',
  //   "Web": '#02a71d',
  //   "Jboss": '#605fb4',
  //   "Autorizador": '#e4be40',
  //   "Pepito": '#e4be40',
  //   "SQL": '#g4ae50',
  //   "MongoDB": '#f4be90',
  //   "Openshift": '#f4be50',
  //   "Servidor": '#a4be40',
  // };
  // [style.background-color]="valoresColores[etiqueta]" atributo del btn en el front

  public separatorKeysCodes: number[] = [ENTER, COMMA];

  public tagCtrl = new FormControl('');

  public filteredTags!: Observable<string[]>;

  public tags: string[] = [];

  public allTags: string[] = ['Abacom', 'Web', 'Jboss', 'Autorizador', 'SQL', 'MongoDB', 'Openshift', 'Servidor'];
  
  public announcer = inject(LiveAnnouncer);

  public keyword:string = '';

  public tagSelected:string[] = [];
  
  @ViewChild('tagInput')
  tagInput!: ElementRef<HTMLInputElement>;
  
  constructor( 
    private dbService: DbService,
    public dialog: MatDialog
  ) {
    this.filteredTags = this.tagCtrl.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) => (tag ? this._filter(tag) : this.allTags.slice())),
    );
  }

  @ViewChild('searchTag')
  public searchInput!: ElementRef<HTMLInputElement>;
  
  
  ngOnInit(): void {
    this.getNovedades();
  }

  getNovedades(){
    this.dbService.getNovedades().subscribe( novedades => {
  
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
  
      this.sorted = this.sortedList(this.listNovedades);
    })

    setTimeout(() => {
      this.loader = !this.loader;
    },1000)
  }
  
  isEmpty(obj: object): boolean {
    return Object.keys(obj).length === 0;
  }  

  openDialog(item:Novedad){
    this.dialog.open(DialogNovedadComponent,{
      data: item
    });
  }

  searchNovedadesByKeyword() {
    const newKeyword = this.searchInput.nativeElement.value.toLowerCase();
    this.keyword = newKeyword;

    if(this.tagSelected.length > 0){
      this.searchByKeywordAndTags(this.tagSelected,this.keyword);
    }

    if(this.keyword && this.tagSelected.length == 0){
      
      this.dbService.getNovedadesByKeyword(newKeyword).subscribe( (novedades:Novedad[]) => {
        this.filteredNovedades = {};
        
        novedades.forEach((novedad:Novedad) => {
          
          const fecha = new Date(novedad.created_at);
          const mes = fecha.toLocaleString('es-ES',{month:'long'});
          const anio = fecha.getFullYear();
          const key = `${mes}-${anio}`;
          
          if(!this.filteredNovedades[key]){
            this.filteredNovedades[key] = [];
          }
          this.filteredNovedades[key].push(novedad);
        });
        this.sorted = this.sortedList(this.filteredNovedades);

      });
      
    }else if(this.keyword && this.tagSelected){
      this.searchByKeywordAndTags(this.tagSelected, newKeyword);

    }else{
      this.filteredNovedades = this.listNovedades;
      this.keyword = '';

    }
    this.sorted = this.sortedList(this.filteredNovedades);
  }

  searchByTags(tags: string[]) {
    this.tagSelected = tags;

    if(this.keyword){
      this.searchByKeywordAndTags(tags, this.keyword);
    }

    if(this.tagSelected.length > 0 && !this.keyword){
      this.dbService.getNovedadesByTags(tags).subscribe( (novedades:Novedad[]) => {
        this.filteredNovedades = {};

        novedades.forEach((novedad:Novedad) => {
          const fecha = new Date(novedad.created_at);
          const mes = fecha.toLocaleString('es-ES',{month:'long'});
          const anio = fecha.getFullYear();
          const key = `${mes}-${anio}`;

          if(!this.filteredNovedades[key]){
            this.filteredNovedades[key] = [];
          }
          this.filteredNovedades[key].push(novedad); 

        });
        this.sorted = this.sortedList(this.filteredNovedades);

      });

    }else if(this.tagSelected.length > 0 && this.keyword){
      this.searchByKeywordAndTags(tags, this.keyword);

    }else{
      this.filteredNovedades = this.listNovedades;
      this.tagSelected = [];

    };
    this.sorted = this.sortedList(this.filteredNovedades);
  }
  
  searchByKeywordAndTags(tags:string[], keyword:string){

    if(this.tagSelected.length > 0 && keyword){
      this.dbService.getNovedadesByKeywordAndTags(tags, keyword).subscribe((novedades:Novedad[]) => {
        this.filteredNovedades = {};
        
        novedades.forEach((novedad:Novedad) => {
          const fecha = new Date(novedad.created_at);
          const mes = fecha.toLocaleString('es-ES',{month:'long'});
          const anio = fecha.getFullYear();
          const key = `${mes}-${anio}`;
  
          if(!this.filteredNovedades[key]){
            this.filteredNovedades[key] = [];
          }
          this.filteredNovedades[key].push(novedad);
  
        });
        this.sorted = this.sortedList(this.filteredNovedades);
  
      });
    }else if(!keyword && tags){
      this.searchByTags(tags);

    }else{
      this.searchNovedadesByKeyword();
      
    }

    this.sorted = this.sortedList(this.filteredNovedades);
  }


  private sortedList(novedades:{ [mes: string]: Novedad[] }):string[]{
    return Object.keys(novedades).sort((a, b) => {
      const fechaA = new Date(a.split('-')[1]);
      const fechaB = new Date(b.split('-')[1]);
      return fechaB.getTime() - fechaA.getTime();
    });
  }

  openTags(){
    this.searchTags = !this.searchTags;
  }
  
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = (event.value || '').trim();
  
    if (value) {
      this.tags.push(value);
    }

    if (input) {
      input.value = '';
    }

    this.tagCtrl.setValue(null);
    this.searchByTags(this.tags);
  }
  

  remove(tag: string): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
      this.announcer.announce(`Removed ${tag}`);
      this.searchByTags(this.tags);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.tags.push(event.option.viewValue);
    this.searchByTags(this.tags);
    this.tagInput.nativeElement.value = '';
    this.tagCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allTags.filter(tag => tag.toLowerCase().includes(filterValue));
  }
  
}


