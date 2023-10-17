import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { DbService } from 'src/app/services/db-service.service';

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
  ){}

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

  public edit = false;
  
  private idNovedad!:string;

  public etiquetas:string[] = [
    "Abacom", "Web", "Autorizador", "Jboss", "Pepito", "SQL", "Openshift", "Servidor", "MongoDB"
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
 
  saveNovedad(){
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

}
