import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss']
})
export class LobbyComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    if(this.authService.isAuthenticated()) {
      return;
    }
    else {
      this.router.navigate(['/login']);
    }
  }

  logout() {
    this.authService.logout().then((data) => {
      this.router.navigate(['/login']);
    });
  }
}
