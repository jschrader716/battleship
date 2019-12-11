import { BrowserModule } from '@angular/platform-browser';
import {FormsModule } from '@angular/forms'
import { NgModule } from '@angular/core';


import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { HttpClientModule } from '@angular/common/http';

// services
import { JwtHelperService } from '@auth0/angular-jwt';

// components
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { LobbyComponent } from './lobby/lobby.component';
import { GameboardComponent } from './gameboard/gameboard.component';
import { CellComponent } from './cell/cell.component';
import { ChatComponent } from './chat/chat.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'lobby', component: LobbyComponent, canActivate: [AuthGuard] },
  { path: 'game', component: GameboardComponent, canActivate: [AuthGuard] },
  { path: 'chat', component: ChatComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login', pathMatch: 'full' }
]

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LobbyComponent,
    GameboardComponent,
    CellComponent,
    ChatComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
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
