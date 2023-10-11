import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Novedad } from '../interfaces/novedad';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NovedadesService {

  constructor( private http:HttpClient ) { }

  getNovedadesJson():Observable<Novedad[]>{
    return this.http.get<Novedad[]>('assets/data/novedades.json');
  }

}
