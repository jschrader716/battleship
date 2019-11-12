import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GameInfo {
    rows: 10;
    cols: 10;
    xhtmlns: 'http://www.w3.org/1999/xhtml';
    svgns: 'http://www.w3.org/2000/svg';
    boardX: 50; // starting x position of board
    boardY: 50; // starting y position of board
    boardArr: []; // board information
    cellsize: 75; // size of the cell...
}
