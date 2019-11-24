import { Injectable } from '@angular/core';
import * as AWSCognito from "amazon-cognito-identity-js";

@Injectable({
  providedIn: 'root'
})
export class CognitoService {

  constructor() { }

  public cognitoUser:any;

  public poolData = {
    UserPoolId: "us-east-2_pnodc4HoZ",
    ClientId: "2tb0f012gjikege0qft7epn3cm"
  };

  /*
  =========================
    Registration
  =========================
  */
  register(registerData: any): Promise<any> {
    console.log(registerData);
    return new Promise((resolve, reject) => {
      let _this = this;

      var userPool = new AWSCognito.CognitoUserPool(this.poolData);

      var attributeList = [];
      var attributeEmail = new AWSCognito.CognitoUserAttribute({
        Name: "email",
        Value: registerData.email
      }
      );

      attributeList.push(attributeEmail);

      userPool.signUp(
        registerData.username,
        registerData.password,
        attributeList,
        null,
        function(err, result) {
          if (err) {
            reject(err);
          }
          else {
            resolve(result);
          }
        }
      );
    });
  }

  login(loginData: any): Promise<any> {
    return new Promise((resolve, reject) => {

      var userPool = new AWSCognito.CognitoUserPool(this.poolData);

      var authDetails = new AWSCognito.AuthenticationDetails(
        {
          Username: loginData.username,
          Password: loginData.password
        }
      );

      var userData = {
          Username: loginData.username,
          Pool: userPool,
      };

      this.cognitoUser = new AWSCognito.CognitoUser(userData);
      this.cognitoUser.authenticateUser(authDetails, {
        onSuccess: (result) => {
          resolve(result);
        },
        onFailure: function(err) {
            reject(err);
        },
      });
    });
  }

  logout(): Promise<any> {
    return new Promise((resolve, reject) => {
      let cognitoUser = new AWSCognito.CognitoUserPool(this.poolData).getCurrentUser();

      cognitoUser.getSession((err, session) => {
        if (err) {
          reject(err);
        } 
        else {
          if(session.isValid()) {
            cognitoUser.signOut();
            resolve(true);
          }
          else {
            resolve(false);
          }
        }
      })

      return true;
    });
  }

  isAuthenticated(): Promise<boolean> {
    let cognitoUser = new AWSCognito.CognitoUserPool(this.poolData).getCurrentUser();
    let userAuth = false;

    return new Promise(function(resolve, reject) {
      if (cognitoUser != null) {
        return cognitoUser.getSession(function(err, session) {
          if (err) {
            userAuth = false;
          } else {
            userAuth = session.isValid();
          }

          resolve(userAuth);
        });
      } else {
        userAuth = false;
        resolve(userAuth);
      }
    });
  }

  getCurrentUser(): Promise<any> {
    return new Promise((resolve, reject) => {
      let cognitoUser = new AWSCognito.CognitoUserPool(this.poolData).getCurrentUser();
      resolve(cognitoUser);
    })
  }
}
