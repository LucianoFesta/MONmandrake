import { LiveAnnouncer } from '@angular/cdk/a11y';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { formatDate } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable, catchError, map, of, startWith } from 'rxjs';
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
    public dbService:DbService,
    private fb:FormBuilder,
    public dialogRef: MatDialogRef<DialogNovedadComponent>
  ){
    this.filteredTags = this.tagCtrl.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) => (tag ? this._filter(tag) : this.allTags.slice())),
    );

    console.log(this.edit)
  }

  public tagCtrl = new FormControl('');

  public separatorKeysCodes: number[] = [ENTER, COMMA];

  public filteredTags!: Observable<string[]>;

  public announcer = inject(LiveAnnouncer);

  public tags: string[] = [];

  public allTags: string[] = ['Abacom', 'Web', 'Jboss', 'Autorizador', 'Pepito', 'SQL', 'MongoDB', 'Openshift', 'Servidor'];

  public formCreate:FormGroup = this.fb.group({
    autor: ['', [ Validators.required ]],
    etiquetas: ['', [Validators.required]],
    descripcion: ['', [ Validators.required ]],
    estado:[1],
    created_at:[''],
    updated_at:[''],
  });

  public novedad:Novedad = this.data;

  public edit:boolean = false;

  editNovedad(){
    this.edit = !this.edit;
  }

  eliminarNovedad(id:string){
    this.dbService.deleteNovedad(id).subscribe(() => {
      this.dialog.closeAll();
      
      location.reload();
    });
  }

  isValidField(field:string):boolean | null{
    return this.formCreate.controls[field].errors && this.formCreate.controls[field].touched;
  };

  editNovedadById(id:string){

    if(this.formCreate.invalid){
      this.formCreate.markAllAsTouched();
      return;
    }

    let newNovedad = this.formCreate.value;

    newNovedad.updated_at = formatDate(Date.now(), 'yyyy-MM-ddTHH:mm', 'en-US');
    
    this.dbService.editNovedad(newNovedad, id).pipe(
      catchError((e) => {
        console.log(e)
        return of()
      })
    ).subscribe(() => {
      this.router.navigateByUrl('home');
    })

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
