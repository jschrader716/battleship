import { Injectable } from '@angular/core';
import { CognitoService } from './cognito.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private cognitoService: CognitoService) { }

  private isLoggedIn = false;

  redirectUrl: string;

  register(creds): Promise<any> {
    return new Promise((resolve, reject) => {
      this.cognitoService.register(creds).then((data) => {
        this.isLoggedIn = true;
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("token", require('jwthelper'));
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
    })
  }

  login(creds): Promise<any> {
    return new Promise((resolve, reject) => {
      this.cognitoService.login(creds).then((data) => {
        this.isLoggedIn = true;
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("token", require('jwthelper'));
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
    })
  }

  logout(): void {
    this.isLoggedIn = false;
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn;
  }
}
