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

  setShipsAlert() {
    swalChallenge.fire(
      {
        title: 'PREPARE FOR WAR!',
        html: 'Strategically place your ships in the water',
        icon: 'info',
      }
    )
  }
}
