import { Component, OnInit } from '@angular/core';
import { CognitoService } from "../services/cognito.service";

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  
  public signup: boolean = false;

  constructor(private cognitoService: CognitoService) {

  }

  ngOnInit() {
  }

  login(creds) {
    console.log(creds);
  }

  register(creds) {
    this.cognitoService.register(creds).then((data) => {
      console.log(data);
    });
  }

}
