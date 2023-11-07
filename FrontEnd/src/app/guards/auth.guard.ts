import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router } from "@angular/router";
import { User } from "../interfaces/userKeycloak";

@Injectable({
  providedIn: 'root',
})

export class AuthGuard implements CanActivate {
  constructor( 
    private router:Router
  ){}

  canActivate(route: ActivatedRouteSnapshot): boolean {

    const user = localStorage.getItem('userCurrent');
    if (!user) {
        this.router.navigate(['/']);
        return false;

    }else if(user){
      const userObj:User = JSON.parse(user);

      if(Date.now() >= userObj.expToken){
        localStorage.removeItem('userCurrent')
        this.router.navigateByUrl(`/`);

        return false;
      }
    }
    return true;
  }
}