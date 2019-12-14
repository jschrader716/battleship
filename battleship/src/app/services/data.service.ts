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
  // GAME LOBBY FUNCTIONS
  //=============================================================================================================
  createGame(gameData): Observable<any> {
      return this.http.post(this.environment.apiUrl + '/game', gameData, httpOptions);
  }

  getGameState(id) {
    return new Promise((resolve) => {
      this.http.get(this.environment.apiUrl + '/game', { params: { id: id } }).subscribe((data) => {
        resolve(data);
      });
    });
  }

  getChallengeResponses(username) {
    return new Promise((resolve) => {
      this.http.get(this.environment.apiUrl + '/game', { params: { challenger: username } }).subscribe((data) => {
        resolve(data);
      });
    });
  }

  getChallenges(username) {
    return new Promise((resolve) => {
      this.http.get(this.environment.apiUrl + '/game', { params: { username: username } }).subscribe((data) => {
        resolve(data);
      });
    });
  }

  updateGameState(data) {
    return new Promise((resolve) => {
      this.http.put(this.environment.apiUrl + '/game', data, httpOptions).subscribe((data) => {
        resolve(data);
      });
    });
  }

  deleteGameById(id): Promise<any> {
    return new Promise((resolve) => {
      this.http.delete(this.environment.apiUrl + '/game', { params: { game_id: id } }).subscribe((data) => {
        console.log("DELETION DATA: ", data);
        resolve(data);
      });
    });
  }

  deleteAllGames(username): Promise<any> {
    return new Promise((resolve) => {
      this.http.delete(this.environment.apiUrl + '/game', { params: { username: username } }).subscribe((data) => {
        resolve(data);
      });
    });
  }

  //=============================================================================================================
  // GAME BOARD API FUNCTIONS
  //=============================================================================================================
  getBoardState(boardInfo): Promise<any> {
    return new Promise((resolve) => {
      this.http.get(this.environment.apiUrl + '/game/board', { params: { id: boardInfo.id, player: boardInfo.player } }).subscribe((data) => {
        resolve(data);
      });
    });
  }

  createBoard() {
    return this.http.post(this.environment.apiUrl + '/game/board', httpOptions);
  }

  updateBoardState(body): Promise<any> {
    return new Promise((resolve) => {
      this.http.put(this.environment.apiUrl + '/game/board', body, httpOptions).subscribe((data) => {
        resolve(data);
      });
    });
  }

  deleteBoard(boardId): Promise<any> {
    return new Promise((resolve) => {
      this.http.delete(this.environment.apiUrl + '/game/board', { params: { id: boardId } }).subscribe((data) => {
        console.log("DELETION DATA: ", data);
        resolve(data);
      });
    });
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
