import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { UserLogin } from '../Models/UserLogin';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { LoginService } from '../Services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginService = inject(LoginService);

  hide = true;

  isAuth = false;

  usernameFormControl = new FormControl("");

  passwordFormControl = new FormControl("");

  loginFormGroup = this._formBuilder.group({
    username: this.usernameFormControl,
    password: this.passwordFormControl,
  });

  constructor(private _formBuilder: FormBuilder) {}

  
  clickEvent(event: MouseEvent) {
    this.hide = !this.hide;
    event.stopPropagation();
  }

  login() : void {
    const user: UserLogin = {
      username: this.usernameFormControl.value ? this.usernameFormControl.value : "",
      password: this.passwordFormControl.value ? this.passwordFormControl.value : ""
    }
    this.loginService.login(user).subscribe(
      (response) => {
        if (response.status === 200) {
          this.loginService.auth(response.body.token)
        } else {
          console.error('Login failed', response);
        }
      },
      (error) => {
        if (error.status === 401) {
          console.error('Unauthorized: Invalid credentials');
        } else {
          console.error('An error occurred:', error);
        }
      }
    );
  }

}
