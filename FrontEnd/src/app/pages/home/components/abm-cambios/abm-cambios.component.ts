import { formatDate } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { DbService } from 'src/app/services/db-service.service';

@Component({
  selector: 'app-abm-cambios',
  templateUrl: './abm-cambios.component.html',
  styleUrls: ['./abm-cambios.component.css']
})

export class AbmCambiosComponent{

  constructor( 
    private fb:FormBuilder,
    private dbService:DbService,
    private router:Router
  ){}

  public etiquetas:string[] = [
    "Abacom", "Web", "Autorizador", "Jboss"
  ];

  public formCreate:FormGroup = this.fb.group({
    autor: ['', [ Validators.required ]],
    responsable: ['', [ Validators.required ]],
    etiquetas: ['', [Validators.required]],
    descripcion: ['', [ Validators.required ]],
    estado:[1],
    created_at:[''],
    updated_at:[''],
  });
 
  submit(){
    if(this.formCreate.invalid){
      this.formCreate.markAllAsTouched();
      return;
    }

    let newNovedad = this.formCreate.value;

    newNovedad.created_at = formatDate(Date.now(), 'yyyy-MM-ddTHH:mm', 'en-US');
    newNovedad.updated_at = formatDate(Date.now(), 'yyyy-MM-ddTHH:mm', 'en-US');
    
    this.dbService.createNovedad(newNovedad).pipe(
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

}
