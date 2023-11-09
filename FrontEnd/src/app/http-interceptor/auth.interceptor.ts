import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../interfaces/userKeycloak';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private router: Router
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let currentUserJson = localStorage.getItem('userCurrent');

    if (request.url.startsWith('/')) {
      return next.handle(request);
    }

    if (currentUserJson) {
        const currentUserObj:User = JSON.parse(currentUserJson);
        if (currentUserObj.token) {
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${currentUserObj.token}`
            }
          });
        }
      }

      return next.handle(request).pipe(
        tap (() => {}, 
            (err: any) => {
                if (err instanceof HttpErrorResponse) {
                if (err.status !== 401) {
                    return;
                }
                this.router.navigateByUrl('/');
                }
        })
    );
    
    }
}