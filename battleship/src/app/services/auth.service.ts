import { Injectable } from '@angular/core';
import { CognitoService } from './cognito.service';

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
        if(data == true) {
          resolve(true);
        }
        else {
          resolve(false);
        }
      })
      .catch((error) => {
        reject(false);
      });
    })
  }

  getLoginStatus() {
    return this.isLoggedIn;
  }
}
