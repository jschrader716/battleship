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


  //=============================================================================================================
  // GAME BOARD API FUNCTIONS
  //=============================================================================================================
  getBoardState() {
    return new Promise((resolve) => {
      this.http.get(this.environment.apiUrl + '/game/board').subscribe((data) => {
        console.log(data);
        resolve(data);
      });
    });

    // let boardstate = new BoardState({
    //   // pass in key value pairs as they coming from the daaaaaatabase betch
    //   id: 0,
    //   board_state_1: "0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
    //   board_state_2: "0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
    //   turn: 0,
    //   max_turn: 0,
    //   game_terminated: false,
    // });

    // return boardstate;
  }

  createGame(gameData): Promise<any> {
    return new Promise((resolve) => {
      resolve(this.http.post(this.environment.apiUrl + '/game/', gameData, httpOptions));
    })
    .catch((err) => {
      console.log("Something went wrong when creating the game");
    })
  }

  createBoard() {
    return this.http.post(this.environment.apiUrl + '/game/board', httpOptions).subscribe((data) => {});
  }

  updateBoardState(body): Promise<any> {
    return new Promise((resolve) => {
      this.http.put(this.environment.apiUrl + '/game/board', body, httpOptions).subscribe((data) => {
        resolve(data);
      });
    });
  }

  getTurn() {

  }


  //=============================================================================================================
  // CHAT API FUNCTIONS
  //=============================================================================================================

  getAllMessages(username): Promise<any> {
    return new Promise((resolve) => {
      this.http.get(this.environment.apiUrl + '/chat', { params: { username: username } }).subscribe((data) => {
        resolve(data);
      });
    });
  }

  sendMessage(data) {
    return this.http.post(this.environment.apiUrl + '/chat', data, httpOptions).subscribe((data) => {});
  }


  //=============================================================================================================
  // USER API FUNCTIONS
  //=============================================================================================================

  getActiveUsers(gameroomId): Promise<any> {
    return new Promise((resolve) => {
      this.http.get(this.environment.apiUrl + '/user', { params: { game_id: gameroomId } }).subscribe((data) => {
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

  getUser(username): Promise<any> {
    return new Promise((resolve) => {
      this.http.get(this.environment.apiUrl + '/user', { params: { username: username } }).subscribe((data) => {
        resolve(data);
      });
    });
  }
}
