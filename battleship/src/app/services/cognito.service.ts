import { Injectable } from '@angular/core';
import * as AWSCognito from "amazon-cognito-identity-js";
import * as AWS from "aws-sdk";

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
      this.cognitoUser.signOut();

    });
  }
}
