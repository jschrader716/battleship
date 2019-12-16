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

  constructor(router: Router) {

    router.events.pipe(
      filter(
        ( event: NavigationEvent ) => {

            return( event instanceof NavigationStart );

        }
      )
    ).subscribe((event: NavigationStart) => {
      if ( event.restoredState ) {

        // console.log( "navigation id:", event.id );
        // console.log( "route:", event.url );
        // console.warn(
        //     "restoring navigation id:",
        //     event.restoredState.navigationId
        // );
      }
    })
  }
}

