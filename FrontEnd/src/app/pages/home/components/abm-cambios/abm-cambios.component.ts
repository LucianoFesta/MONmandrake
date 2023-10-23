import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { formatDate } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, catchError, map, of, startWith } from 'rxjs';
import { DbService } from 'src/app/services/db-service.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-abm-cambios',
  templateUrl: './abm-cambios.component.html',
  styleUrls: ['./abm-cambios.component.css']
})

export class AbmCambiosComponent implements OnInit{

  constructor( 
    private fb:FormBuilder,
    private dbService:DbService,
    private router:Router,
    private route:ActivatedRoute
  ){
    this.filteredTags = this.tagCtrl.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) => (tag ? this._filter(tag) : this.allTags.slice())),
    );
  }

  ngOnInit(): void {

    this.route.params.subscribe( params => {
      if(params['id']){
        this.edit = true;
        this.idNovedad = params['id'];

        this.dbService.findById(this.idNovedad).subscribe( novedad => {
          this.formCreate.patchValue({
            autor: novedad.autor,
            responsable: novedad.responsable,
            etiquetas: novedad.etiquetas,
            descripcion: novedad.descripcion,
            estado: novedad.estado,
            created_at: novedad.created_at,
            updated_at: new Date(novedad.updated_at),
          })
        })
      }
    })
    
  }

  public tagCtrl = new FormControl('');

  public separatorKeysCodes: number[] = [ENTER, COMMA];

  public filteredTags!: Observable<string[]>;

  public announcer = inject(LiveAnnouncer);

  public tags: string[] = [];

  public allTags: string[] = ['Abacom', 'Web', 'Jboss', 'Autorizador', 'Pepito', 'SQL', 'MongoDB', 'Openshift', 'Servidor'];

  public edit = false;
  
  private idNovedad!:string;

  public etiquetas:string[] = [
    "Abacom", "Web", "Autorizador", "Jboss", "Pepito", "SQL", "Openshift", "Servidor", "MongoDB"
  ];

  public formCreate:FormGroup = this.fb.group({
    autor: ['', [ Validators.required ]],
    etiquetas: ['', [Validators.required]],
    descripcion: ['', [ Validators.required ]],
    estado:[1],
    created_at:[''],
    updated_at:[''],
  });
 
  saveNovedad(){
    if(this.formCreate.invalid){
      this.formCreate.markAllAsTouched();
      return;
    }

    let newNovedad = this.formCreate.value;

    newNovedad.created_at = formatDate(Date.now(), 'yyyy-MM-ddTHH:mm', 'en-US');
    newNovedad.updated_at = formatDate(Date.now(), 'yyyy-MM-ddTHH:mm', 'en-US');
    newNovedad.responsable = this.formCreate.get('autor')?.value;
    

    this.dbService.createNovedad(newNovedad).pipe(
      catchError((e) => {
        console.log(e)
        return of()
      })
    ).subscribe(() => {
      window.location.reload();
    })

  };

  editNovedad(){
    if(this.formCreate.invalid){
      this.formCreate.markAllAsTouched();
      return;
    }

    let newNovedad = this.formCreate.value;

    newNovedad.updated_at = formatDate(Date.now(), 'yyyy-MM-ddTHH:mm', 'en-US');
    
    this.dbService.editNovedad(newNovedad,this.idNovedad).pipe(
      catchError((e) => {
        console.log(e)
        return of()
      })
    ).subscribe(() => {
      this.router.navigateByUrl('home');
    })

  };

  isValidField(field:string):boolean | null{
    return this.formCreate.controls[field].errors && this.formCreate.controls[field].touched;
  };

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.tags.push(value);
    }
    event.chipInput!.clear();
    this.tagCtrl.setValue(null);

  }

  remove(tag: string): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
      this.announcer.announce(`Removed ${tag}`);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.tags.push(event.option.viewValue);
    this.tagCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allTags.filter(tag => tag.toLowerCase().includes(filterValue));
  }
  

}
