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
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
    })
  }

  logout(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.cognitoService.logout().then((data) => {
        console.log("Auth Service: " + data);
        if(data) {
          this.isLoggedIn = false;
          resolve(data);
        }
        else {
          resolve(data);
        }
      });
    })

  }

  isAuthenticated(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.cognitoService.isAuthenticated().then((data) => {
        return true;
      })
      .catch((error) => {
        return false;
      });
    })
  }

  getLoginStatus() {
    return this.isLoggedIn;
  }
}
