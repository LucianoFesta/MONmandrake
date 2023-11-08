import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DbService } from '../../services/db-service.service';
import { TokenDecode, User } from 'src/app/interfaces/userKeycloak';
import jwt_decode from "jwt-decode";
import { UserKeycloak } from '../../interfaces/userKeycloak';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor( 
    private fb:FormBuilder,
    private router:Router,
    private dbService:DbService,
    private snackBar: MatSnackBar,
  ){};

  public hide = true;

  public formLogin:FormGroup = this.fb.group({
    username: ['', [ Validators.required ]],
    password: ['', [ Validators.required ]]
  });


  isValidField( field:string ):boolean | null {
    return this.formLogin.controls[field].errors && this.formLogin.controls[field].touched; 
  }

  showSnackbar(message:string):void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000
    });
  }

  submit(){
    if(this.formLogin.invalid){
      this.formLogin.markAllAsTouched();
      return;
    }

    if(this.formLogin.valid){
      let username = this.formLogin.get('username')?.value;
      let password = this.formLogin.get('password')?.value;

      this.dbService.login(username,password).subscribe( {
        next: (data:any) => {
          if(data.access_token){
            let decoded:TokenDecode = <TokenDecode>jwt_decode(data.access_token);
    
            const keyCloakUser:User = {
              fullName: decoded.name,
              name: decoded.given_name,
              roles: decoded.resource_access.monstatuspage.roles,
              emailVerify: decoded.email_verified,
              expToken: decoded.exp * 1000,
              token: data.access_token
            }

            localStorage.setItem('userCurrent', JSON.stringify(keyCloakUser));

            this.router.navigateByUrl('/home');
          }
        },
        error: (e) => {
          this.showSnackbar( `Hay inconvenientes con el usuario y contraseña ingresado: ` + e.error.detail);
          this.formLogin.reset();
        } 
      });
    }
  }
}



