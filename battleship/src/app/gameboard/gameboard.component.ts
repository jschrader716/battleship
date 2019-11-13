import { Component, OnInit } from '@angular/core';
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
    public boardX: number;
    public boardY: number;
    public boardArr: Array<any>;
    public cellsize: number;
    private gameId: string = '';
    public boardState: BoardState;
    


  constructor(private authService: AuthService, private router: Router, private dataService: DataService) { 
    this.rows = this.gameInfo.rows;
    this.cols = this.gameInfo.cols;
    this.svgns = this.gameInfo.svgns;
    this.boardX = this.gameInfo.boardX;
    this.boardY = this.gameInfo.boardY;
    this.boardArr = this.gameInfo.boardArr;
    this.cellsize = this.gameInfo.cellsize;
    this.boardState = dataService.getBoardState();
    console.log(this.boardState.board_state_1_obj);
    this.boardSetup();
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

  boardSetup(){
    //create a parent to stick board in...
    var game = document.createElementNS(this.svgns,'board');
    game.setAttributeNS(null,'transform','translate('+ this.boardX + ',' + this.boardY + ')');
    game.setAttributeNS(null,'id','gId_' + this.gameId);    
    
    //stick g on board
    //document.getElementsByTagName('svg')[0].insertBefore(game, document.getElementsByTagName('svg')[0]);
  
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
