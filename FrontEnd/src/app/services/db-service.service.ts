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

  getNovedadesByKeyword(newKeyword:string):Observable<Novedad[]>{
    return this.http.get<Novedad[]>('http://localhost:8000/novedades/listByKeyword', {params: { keyword:newKeyword }});
  }
  
  getNovedadesByTags(tags:string[]):Observable<Novedad[]>{
    return this.http.get<Novedad[]>('http://localhost:8000/novedades/listByTags', {params: { tags:tags }});
  }

  createNovedad(novedad:Novedad){
    return this.http.post('http://localhost:8000/novedades/crearNovedad',novedad);
  }

  findById(id:string){
    return this.http.get<Novedad>(`http://localhost:8000/novedades/buscarNovedad/${id}`);
  }

  editNovedad(novedad:Novedad, id:string){
    return this.http.put(`http://localhost:8000/novedades/editarNovedad/${id}`,novedad);
  }

  deleteNovedad(id:string){
    return this.http.delete(`http://localhost:8000/novedades/eliminarNovedad/${id}`);
  }

}
