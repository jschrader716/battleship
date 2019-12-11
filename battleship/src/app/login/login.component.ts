import { Component, OnInit } from '@angular/core';
import { AuthService } from "../services/auth.service";
import { AlertService } from "../services/alert.service";
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  
  public signup: boolean = false;

  constructor(private authService: AuthService, private alertService: AlertService, private router: Router, private dataService: DataService) {

  }

  ngOnInit() {

  }

  login(creds) {
    this.authService.login(creds).then((data) => {

      var user = {
        username: data.accessToken.payload.username,
        login: true,
        wins: 0,
        losses: 0,
        gameroom_id: 0
      }

      this.dataService.updateUser(user).then((data) => {
        this.router.navigate(['/lobby']);
      })
    })
    .catch((error) => {
      this.alertService.error("Error: " + error.message);
    });
  }

  register(creds) {
    this.authService.register(creds).then((data) => {
      this.alertService.success("Registration Successful!");
      this.router.navigate(['/lobby']);
    })
    .catch((error) => {
      this.alertService.error("Error: " + error.message);
    });
  }

}
