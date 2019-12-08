import { Component, OnInit, ɵCompiler_compileModuleSync__POST_R3__ } from '@angular/core';
import { GameInfo } from '../models/gameinfo';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { BoardState } from '../models/boardstate';

@Component({
  selector: 'app-gameboard',
  templateUrl: './gameboard.component.html',
  styleUrls: ['./gameboard.component.scss']
})
export class GameboardComponent implements OnInit {

    public gameInfo: GameInfo = new GameInfo();
    public rows: number;
    public cols: number = 10;
    public xhtmlns: string;
    public svgns: string;
    public boardX: string;
    public boardY: string;
    public boardArr: Array<any>;
    public cellsize: number;
    private gameId: string = '1';
    public boardState: BoardState;
    



  constructor(private authService: AuthService, private router: Router, private dataService: DataService) { 
    this.rows = this.gameInfo.rows;
    this.cols = this.gameInfo.cols;
    this.svgns = this.gameInfo.svgns;
    this.boardX = this.gameInfo.boardX;
    this.boardY = this.gameInfo.boardY;
    this.boardArr = this.gameInfo.boardArr;
    this.cellsize = this.gameInfo.cellsize;
    //this.boardState = dataService.getBoardState();
    console.log(this.boardState.board_state_1_obj);
  }

  ngOnInit() {
    this.authService.isAuthenticated().then((data) => {
      if(data == true) {
        return;
      }
      else {
        this.router.navigate(['/login']);
      }
    });
  }

  ngDoCheck() {

  }

  ngAfterViewInit() {
    this.boardSetup();
  }

  boardSetup(){
    var game = document.createElementNS(this.svgns,'game');
    game.setAttributeNS(null, 'x', this.boardX + 'px');
    game.setAttributeNS(null, 'y', this.boardY + 'px');
    game.setAttributeNS(null, 'width', 'auto');
    game.setAttributeNS(null, 'height', 'auto');
    game.setAttributeNS(null,'transform','translate('+ this.boardX + ',' + this.boardY + ')');
    game.setAttributeNS(null,'id','game' + this.gameId);    
    
    //stick game on board
    
    document.getElementsByTagName('svg')[0].appendChild(game);

    var xCellCoord = 0;
    var yCellCoord = 0;
    var cellId = 1;
    this.boardState.board_state_1_obj.forEach(row => {
      row.forEach(element => {
        var cell = document.createElementNS(this.svgns,'rect');
        cell.setAttributeNS(null, 'stroke', 'red');
        cell.setAttributeNS(null, 'fill', '#55697A');
        cell.setAttributeNS(null, 'width', this.cellsize + 'px');
        cell.setAttributeNS(null, 'height', this.cellsize + 'px');
        cell.setAttributeNS(null, 'x', this.cellsize * xCellCoord + 75 + 'px');
        cell.setAttributeNS(null, 'y', this.cellsize * yCellCoord + 75 + 'px');
        cell.setAttributeNS(null, 'class', 'cell');
        cell.setAttributeNS(null, 'id', 'cell_' + cellId);
        document.getElementsByTagName('svg')[0].appendChild(cell);
        // document.getElementById('game1').appendChild(cell);
        xCellCoord++;
        cellId++;
      });
      yCellCoord++;
      xCellCoord = 0;
    });
  
    ////////////////////////////end write new code here///////////////////////
    //put the drop code on the document...
    // document.getElementsByTagName('svg')[0].addEventListener('mouseup',releaseMove,false);
    // //put the go() method on the svg doc.
    // document.getElementsByTagName('svg')[0].addEventListener('mousemove',go,false);
    // //put the player in the text
    // document.getElementById('youPlayer').firstChild.data+=player0;
    // document.getElementById('opponentPlayer').firstChild.data+=player1;
  }

}
