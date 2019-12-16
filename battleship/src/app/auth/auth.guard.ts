import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { DataService } from '../services/data.service';
import { CognitoService } from '../services/cognito.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private authService:AuthService, private dataService: DataService, private cognitoService: CognitoService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    var url: string = state.url;

    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {
    if(this.authService.isAuthenticated()) {
      return true;
    }
    else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
