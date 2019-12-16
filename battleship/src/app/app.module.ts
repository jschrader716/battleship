import { BrowserModule } from '@angular/platform-browser';
import {FormsModule } from '@angular/forms'
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { HttpClientModule } from '@angular/common/http';
import { NgxUiLoaderModule, NgxUiLoaderConfig } from  'ngx-ui-loader';


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
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login', pathMatch: 'full' }
]

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  "bgsColor": "red",
  "bgsOpacity": 1,
  "bgsPosition": "bottom-right",
  "bgsSize": 60,
  "bgsType": "three-strings",
  "blur": 15,
  "delay": 0,
  "fgsColor": "#BEC2CB",
  "fgsPosition": "center-center",
  "fgsSize": 100,
  "fgsType": "three-strings",
  "gap": 12,
  "logoPosition": "bottom-left",
  "logoSize": 100,
  "logoUrl": "../assets/images/battleshiplogo.png",
  "masterLoaderId": "master",
  "overlayBorderRadius": "0",
  "overlayColor": "rgba(40,40,40,0.75)",
  "pbColor": "red",
  "pbDirection": "ltr",
  "pbThickness": 4,
  "hasProgressBar": false,
  "text": "Loading...",
  "textColor": "#BEC2CB",
  "textPosition": "center-center",
  "maxTime": -1,
  "minTime": 500
};

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
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
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
