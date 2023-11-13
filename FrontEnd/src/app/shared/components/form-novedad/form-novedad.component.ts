import { LiveAnnouncer } from '@angular/cdk/a11y';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { formatDate } from '@angular/common';
import { Component, Input, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Router } from '@angular/router';
import { Observable, catchError, map, of, startWith } from 'rxjs';
import { Etiqueta } from 'src/app/interfaces/etiqueta';
import { DbService } from 'src/app/services/db-service.service';

@Component({
  selector: 'app-form-novedad',
  templateUrl: './form-novedad.component.html',
  styleUrls: ['./form-novedad.component.css']
})
export class FormNovedadComponent implements OnInit {

  constructor(
    private fb:FormBuilder,
    public router:Router,
    public dbService:DbService,
  ){
    this.filteredTags = this.tagCtrl.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) => (tag ? this._filter(tag) : this.allTags.slice())),
    );
    this.getEtiquetas();
  }

  ngOnInit(): void {
    if(this.edit){
      this.dbService.findById(this.idNovedad).subscribe( novedad => {
        this.formCreate.patchValue({
          autor: novedad.autor,
          responsable: novedad.responsable,
          etiquetas: novedad.etiquetas,
          fechaNovedad: new Date(novedad.fechaNovedad),
          descripcion: novedad.descripcion,
          titulo: novedad.titulo,
          estado: novedad.estado,
          created_at: novedad.created_at,
          updated_at: new Date(novedad.updated_at),
        })
        this.tags = novedad.etiquetas;
      })

    }
  }

  @Input() edit!:boolean;

  @Input() idNovedad!:string;

  public tagCtrl = new FormControl('');

  public separatorKeysCodes: number[] = [ENTER, COMMA];

  public filteredTags!: Observable<string[]>;

  public announcer = inject(LiveAnnouncer);

  public tags: string[] = [];

  public allTags: string[] = [];

  public formCreate:FormGroup = this.fb.group({
    autor: ['', [ Validators.required ]],
    etiquetas: ['', [ Validators.required ]],
    descripcion: ['', [ Validators.required ]],
    titulo: ['', [ Validators.required ]],
    fechaNovedad: [ new Date(), [ Validators.required ]],
    estado:[1],
    created_at:[''],
    updated_at:[''],
  });



  isValidField(field:string):boolean | null{
    return this.formCreate.controls[field].errors && this.formCreate.controls[field].touched;
  };

   guardarEtiqueta() {
    const etiquetasFormulario = this.formCreate.get('etiquetas')!.value;
    const etiquetasSeparadas = etiquetasFormulario.toString().split(',').map((etiqueta: string) => etiqueta.trim());

    etiquetasSeparadas.forEach((etiqueta: string) => {
      if (!this.allTags.includes(etiqueta)) {
        // Etiqueta no existe en allTags
        const nuevaEtiqueta: Etiqueta = { name: etiqueta };
        this.dbService.createEtiqueta(nuevaEtiqueta).subscribe(
          () => {
            console.log(`Etiqueta '${etiqueta}' creada exitosamente`);
          },
          error => {
            console.error(`Error al crear etiqueta '${etiqueta}'`, error);
          }
        );
      }
    });
  }

  saveNovedad(){
    if(this.formCreate.invalid){
      this.formCreate.markAllAsTouched();
      return;
    }

    let newNovedad = this.formCreate.value;

    newNovedad.created_at = formatDate(Date.now(), 'yyyy-MM-ddTHH:mm', 'en-US');
    newNovedad.updated_at = formatDate(Date.now(), 'yyyy-MM-ddTHH:mm', 'en-US');
    newNovedad.fechaNovedad = formatDate(this.formCreate.get('fechaNovedad')?.value, 'yyyy-MM-ddTHH:mm', 'en-US');
    newNovedad.responsable = this.formCreate.get('autor')?.value;

    console.log(newNovedad)

    this.guardarEtiqueta();

    this.dbService.createNovedad(newNovedad).pipe(
      catchError((e) => {
        console.log(e)
        return of()
      })
    ).subscribe(() => {
      window.location.reload();
    })

  };

  editNovedadById(){
    if(this.formCreate.invalid){
      this.formCreate.markAllAsTouched();
      return;
    }

    let newNovedad = this.formCreate.value;

    newNovedad.updated_at = formatDate(Date.now(), 'yyyy-MM-ddTHH:mm', 'en-US');
    newNovedad.responsable = this.formCreate.get('autor')?.value;

    this.dbService.editNovedad(newNovedad, this.idNovedad).pipe(
      catchError((e) => {
        console.log(e)
        return of()
      })
    ).subscribe(() => {
      window.location.reload();
    })

  };

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.tags.push(value);
      this.formCreate.get('etiquetas')!.setValue(this.tags.join(', '));
    }
    event.chipInput!.clear();
    this.tagCtrl.setValue(null);

  }

  remove(tag: string): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
      this.formCreate.get('etiquetas')!.setValue(this.tags.join(', '));
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

  getEtiquetas(){
    this.dbService.getEtiquetas().subscribe(etiquetas=>{
      etiquetas.forEach((etiqueta:Etiqueta)=>{
        this.allTags.push(etiqueta.name);
      })
    })
  }
}
