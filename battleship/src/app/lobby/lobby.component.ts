import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { CognitoService } from '../services/cognito.service';


@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss']
})
export class LobbyComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router, private dataService: DataService, private cognitoService: CognitoService) { }

  ngOnInit() {
    this.authService.isAuthenticated().then((data) => {
      if(data == true) {
        return;
      }
      else {
        this.router.navigate(['/login']);
      }
    });
  }

  logout() {
    var user = this.cognitoService.getCurrentUser().then((data) => {
      console.log(data);

      var logoutData = {
        username: data.username,
        login: false,
        wins: 0,
        losses: 0,
        gameroom_id: null
      }
      console.log(logoutData);
      this.dataService.updateUser(logoutData).then((data) => {
        this.authService.logout().then((data) => {
          this.router.navigate(['/login']);
        })
        .catch((err) => {
          console.log("Failure to logout user in cognito.");
        });
      })
      .catch((err) => {
        console.log("Failure to update user.");
      });
    });

  }
}
