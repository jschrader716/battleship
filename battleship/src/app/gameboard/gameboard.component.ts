import { Component, OnInit } from '@angular/core';
import { GameInfo } from '../models/gameinfo';
import { CellComponent } from '../cell/cell.component';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gameboard',
  templateUrl: './gameboard.component.html',
  styleUrls: ['./gameboard.component.scss']
})
export class GameboardComponent implements OnInit {

    public rows: number;
    public cols: number;
    public xhtmlns: string;
    public svgns: string;
    public boardX: number;
    public boardY: number;
    public boardArr: Array<any>;
    public cellsize: number;
    private gameId: string = '';

  constructor(private gameInfo: GameInfo, private authService: AuthService, private router: Router) { 
    this.rows = gameInfo.rows;
    this.cols = gameInfo.cols;
    this.svgns = gameInfo.svgns;
    this.boardX = gameInfo.boardX;
    this.boardY = gameInfo.boardY;
    this.boardArr = gameInfo.boardArr;
    this.cellsize = gameInfo.cellsize;
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
