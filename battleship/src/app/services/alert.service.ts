import { Injectable } from '@angular/core';
import swal from 'sweetalert2';
import { resolve } from 'url';

const swalChallenge = swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger'
  },
  buttonsStyling: false
})

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  

  private swal = require('sweetalert2');
  constructor() { }

  error(errorMsg) {
    this.swal.fire(errorMsg);
  }

  success(successMsg) {
    this.swal.fire(successMsg);
  }

  registrationSuccess() {
    this.swal.fire(
      {
        title: "Registration Successful!",
        html: "Please Log In!",
        icon: 'success',
        showCancelButton: false,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        reverseButtons: true,
      }
    );
  }

  disgustingBrowser() {
    this.swal.fire(
      {
        title: 'Disgusting...',
        html: "Why on earth are you using a gross browser?<br /><a href='https://browsehappy.com'>Click here for a happier life</a>",
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Accept',
        cancelButtonText: 'Decline',
        reverseButtons: true,
        position: 'bottom-end',
      }
    );
  }

  challengeAlert(username) {
    return new Promise((resolve) => {
  
      swalChallenge.fire(
        {
          title: 'A challenger approaches!',
          html: "<b>" + username + "</b> wants to play a game.<br/>Do you wish to accept this challenge?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Accept',
          cancelButtonText: 'Decline',
          reverseButtons: true,
          position: 'bottom-end',
        }
      )
      .then((result) => {
  
        if (result.value) {
          swalChallenge.fire(
            {
              title: 'Challenge Accepted!',
              toast: true,
              icon: 'success',
              timer: 2000,
              timerProgressBar: true,
              showConfirmButton: false,
              position: 'bottom-end'
            }
          )
          resolve(result.value);
        } 
        else {
          swalChallenge.fire(
            {
              title: 'Challenge Declined',
              toast: true,
              icon: 'error',
              timer: 2000,
              timerProgressBar: true,
              showConfirmButton: false,
              position: 'bottom-end'
            }
          )
          resolve(false);
        }
      })
    })
    .catch((err) => {
      console.log("Error occured with challenge modal", err);
    })
  }

  playerWins(didWin: boolean): Promise<any> {
    return new Promise((resolve) => {
      swalChallenge.fire(
        {
          title: (didWin) ? 'Winner!' : 'You Lost!',
          html: (didWin) ? "Congratulations! You have won this round of battleship!" : "Better luck next time!",
          icon: (didWin) ? 'success' : 'warning',
          confirmButtonText: 'Navigate Back to Lobby'
        }
      ).then((result) => {
        resolve(result);
      })
      .catch((err) => {
        console.log("Winner message failed");
      })
    });
  }

  quitters(): Promise<any> {
    return new Promise((resolve) => {
      swalChallenge.fire(
        {
          title: "Opponent Gave Up!",
          html: "Congratulations! You have won this round of battleship!<br/>Navigating back to lobby...",
          icon: 'warning',
          timer: 5000,
          timerProgressBar: true,
          showConfirmButton: false,
        }
      ).then((result) => {
        resolve(result);
      })
      .catch((err) => {
        console.log("Winner message failed");
      })
    });
  }

  setShipsAlert() {
    swalChallenge.fire(
      {
        title: 'PREPARE FOR WAR!',
        html: "Strategically place your ships in the water<br/>Press 'R' to rotate ships",
        icon: 'info',
      }
    )
  }

  toastMessageSuccess(message) {
    swalChallenge.fire(
      {
        title: message,
        toast: true,
        icon: 'success',
        timer: 5000,
        timerProgressBar: true,
        showConfirmButton: false,
        position: 'bottom-end'
      }
    )
  }

  toastHit(hit) {
    swalChallenge.fire(
      {
        title: (hit) ? "HIT!" : "MISS!",
        toast: true,
        icon: (hit) ? 'success' : 'warning',
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
        position: 'center'
      }
    )
  }

  toastMessageError(message) {
    swalChallenge.fire(
      {
        title: message,
        toast: true,
        icon: 'error',
        timer: 5000,
        timerProgressBar: true,
        showConfirmButton: false,
        position: 'bottom-end'
      }
    )
  }
}
