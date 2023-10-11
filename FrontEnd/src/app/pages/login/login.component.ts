import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor( 
    private fb:FormBuilder,
    private router:Router
  ){};

  public hide = true;

  public formLogin:FormGroup = this.fb.group({
    email: ['', [ Validators.required, Validators.pattern(/^.+@sancorsalud\.com\.ar$/) ]],
    password: ['', [ Validators.required ]]
  });


  isValidField( field:string ):boolean | null {
    return this.formLogin.controls[field].errors && this.formLogin.controls[field].touched; 
  }

  submit(){
    if(this.formLogin.invalid){
      this.formLogin.markAllAsTouched();
      return;
    }

    if(this.formLogin.valid){
      this.router.navigateByUrl('home');
    }
  }

}
