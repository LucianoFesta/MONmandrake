import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Novedad } from '../interfaces/novedad';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  constructor( private http:HttpClient ) { }

  getNovedades():Observable<Novedad[]>{
    return this.http.get<Novedad[]>('http://localhost:8000/novedades/listado');
  }

  createNovedad(novedad:Novedad){
    return this.http.post('http://localhost:8000/novedades/crearNovedad',novedad);
  }


}
