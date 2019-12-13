export class GameInfo {
    rows: number = 10;
    cols: number = 10;
    xhtmlns: string = 'http://www.w3.org/1999/xhtml';
    svgns: string = 'http://www.w3.org/2000/svg';
    boardX: string = '0'; // starting x position of board
    boardY: string ='0'; // starting y position of board
    boardArr: any[] = []; // board information
    cellsize: number = 75; // size of the cell...
}
