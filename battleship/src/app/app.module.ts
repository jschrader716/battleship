import { BrowserModule } from '@angular/platform-browser';
import {FormsModule } from '@angular/forms'
import { NgModule } from '@angular/core';


import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

// services
import { JwtHelperService } from '@auth0/angular-jwt';

// components
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { LobbyComponent } from './lobby/lobby.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'lobby', component: LobbyComponent, canActivate: [AuthGuard] }
]

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LobbyComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(
      routes
    )
  ],
  providers: [
    JwtHelperService
  ],
  bootstrap: [AppComponent]
})


export class AppModule { }
