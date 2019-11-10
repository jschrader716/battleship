import { Injectable } from '@angular/core';
import swal from 'sweetalert2';

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
}
