import { Injectable } from '@angular/core';
import { BoardState } from '../models/boardstate';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

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
}
