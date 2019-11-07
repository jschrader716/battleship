import { Injectable } from '@angular/core';
import * as AWSCognito from "amazon-cognito-identity-js";
import * as AWS from "aws-sdk";

@Injectable({
  providedIn: 'root'
})
export class CognitoService {

  constructor() { }

  public poolData = {
    UserPoolId: "us-east-2_GslHWXppq",
    ClientId: "6gavk3tn5va320anugfrecak85"
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
      });

      attributeList.push(attributeEmail);

      userPool.signUp(
        registerData.email,
        registerData.password,
        attributeList,
        null,
        function(err, result) {
          if (err) {
            reject(err);
          }
          else {
            var cognitoUser = result.user;
            console.log('user name is ' + cognitoUser.getUsername());
          }
        }
      );
    });
  }
}
