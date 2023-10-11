import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Novedad } from 'src/app/interfaces/novedad';
import { NovedadesService } from 'src/app/services/novedades.service';

@Component({
  selector: 'app-abm-cambios',
  templateUrl: './abm-cambios.component.html',
  styleUrls: ['./abm-cambios.component.css']
})
export class AbmCambiosComponent implements OnInit {

  constructor( 
    private fb:FormBuilder,
    private novedadService:NovedadesService
  ){}

  ngOnInit(): void {
    this.novedadService.getNovedadesJson().subscribe(data => this.listNovedades = data)
  }

  private listNovedades:Novedad[] = [];

  public etiquetas:string[] = [
    "Abacom", "Web", "Autorizador", "JBOSS"
  ];

  public formCreate:FormGroup = this.fb.group({
    id:[12],
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
    
    this.listNovedades.push(newNovedad);

    console.log(this.listNovedades);
  };

  isValidField(field:string):boolean | null{
    return this.formCreate.controls[field].errors && this.formCreate.controls[field].touched;
  };



}
