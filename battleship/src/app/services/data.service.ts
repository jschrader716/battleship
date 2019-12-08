import { Injectable } from '@angular/core';
import { BoardState } from '../models/boardstate';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
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

  createBoard() {
    return this.http.post(this.environment.apiUrl + '/game/board', httpOptions).subscribe((data) => {});
  }

  updateBoardState(body) {
    return new Promise((resolve) => {
      this.http.put(this.environment.apiUrl + '/game/board', body, httpOptions).subscribe((data) => {
        resolve(data);
      });
    });
  }

  getTurn() {

  }

  getAllMessages(): Promise<any> {
    return new Promise((resolve) => {
      this.http.get(this.environment.apiUrl + '/chat').subscribe((data) => {
        resolve(data);
      });
    });
  }

  sendMessage(data) {
    return this.http.post(this.environment.apiUrl + '/chat', data, httpOptions).subscribe((data) => {});
  }

  getActiveUsers(gameroom_id): Promise<any> {
    return new Promise((resolve) => {
      this.http.get(this.environment.apiUrl + '/user', { params: { game_id: gameroom_id } }).subscribe((data) => {
        resolve(data);
      });
    });
  }

  updateUser(body): Promise<any> {
    return new Promise((resolve) => {
      this.http.put(this.environment.apiUrl + '/user', body, httpOptions).subscribe((data) => {
        resolve(data);
      });
    });
  }
}
