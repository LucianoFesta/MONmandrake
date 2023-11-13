import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router } from "@angular/router";

@Injectable({
  providedIn: 'root',
})

export class LoginGuard implements CanActivate {
  constructor( private router:Router ){}

  canActivate(route: ActivatedRouteSnapshot): boolean {

    const user = localStorage.getItem('userCurrent');
    if (user) {
        this.router.navigate(['/home']);
        return false;
    }
    return true;
  }
}