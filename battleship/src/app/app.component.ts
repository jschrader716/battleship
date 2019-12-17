import { Component } from '@angular/core';
import { Router, Event as NavigationEvent, NavigationStart } from '@angular/router';
import { filter } from "rxjs/operators";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'battleship';

  constructor(router: Router) {}
}

