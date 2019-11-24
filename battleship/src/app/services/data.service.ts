import { Injectable } from '@angular/core';
import { BoardState } from '../models/boardstate';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
    //'Authorization': 'my-auth-token'
  })
};

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private environment = environment; 

  constructor(private http: HttpClient) { }

  getBoardState() {
    let boardstate = new BoardState({
      // pass in key value pairs as they coming from the daaaaaatabase betch
      id: 0,
      board_state_1: "0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
      board_state_2: "0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
      turn: 0,
      max_turn: 0,
      game_terminated: false,
    });

    return boardstate;
  }

  updateBoardState() {
    // update this crap
  }

  getTurn() {

  }

  getAllMessages(): Promise<any> {
    return new Promise((resolve) => {
      this.http.get(this.environment.apiUrl + '/chat').subscribe((data) => {
        resolve(data);
      });
      resolve(true);
    });
  }

  sendMessage(data) {
    return this.http.post(this.environment.apiUrl + '/chat', data, httpOptions).subscribe((data) => {
      console.log(data);
    });
  }
}
