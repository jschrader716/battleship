import { Component, OnInit } from '@angular/core';
import { AuthService } from "../services/auth.service";
import { AlertService } from "../services/alert.service";
import { Router } from '@angular/router';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  
  public signup: boolean = false;

  constructor(private authService: AuthService, private alertService: AlertService, private router: Router) {

  }

  ngOnInit() {
  }

  login(creds) {
    this.authService.login(creds).then(data => {
      console.log(data);
      this.router.navigate(['/lobby']);
    })
    .catch((error) => {
      this.alertService.error("Error: " + error);
    });
  }

  register(creds) {
    this.authService.register(creds).then((data) => {
      this.alertService.success("Registration Successful!");
      this.router.navigate(['/lobby']);
    })
    .catch((error) => {
      this.alertService.error("Error: " + error);
    });
  }

}
