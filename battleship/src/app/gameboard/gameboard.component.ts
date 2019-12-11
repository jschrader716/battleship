import { Component, OnInit, OnDestroy } from '@angular/core';
import { GameInfo } from '../models/gameinfo';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { BoardState } from '../models/boardstate';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from '../services/alert.service';

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
    public boardState: BoardState;
    private gameId: number;

  constructor(private authService: AuthService, private router: Router, private dataService: DataService, private route: ActivatedRoute, private alertService: AlertService) { 
    this.rows = this.gameInfo.rows;
    this.cols = this.gameInfo.cols;
    this.svgns = this.gameInfo.svgns;
    this.boardX = this.gameInfo.boardX;
    this.boardY = this.gameInfo.boardY;
    this.boardArr = this.gameInfo.boardArr;
    this.cellsize = this.gameInfo.cellsize;
    this.boardState;
  }

  ngOnInit() {
    this.authService.isAuthenticated().then((data) => {
      if(data == true) {
        this.route.queryParams.subscribe(params => {
          this.gameId = params.board_id;

          this.dataService.getBoardState(this.gameId).then((data) => {
            console.log(data);
            this.boardState = new BoardState(data[0]);
            console.log(this.boardState);
            this.boardSetup();
            // after initial board setup, tell players to set their pieces
            //this.alertService.setShipsAlert();
          })
        });
      }
      else {
        this.router.navigate(['/login']);
      }
    });
  }

  ngOnDestroy() {

  }

  ngDoCheck() {

  }

  boardSetup(){
    var game = document.createElementNS(this.svgns,'g');
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
        cell.setAttributeNS(null, 'id', cellId.toString());
        cell.setAttributeNS(null, 'cursor', 'crosshair');

        cell.addEventListener("mouseover", () => {
          this.buildShips(cell.getAttributeNS(null, 'id'));
        });
        

        document.getElementsByTagName('g')[0].appendChild(cell);
        xCellCoord++;
        cellId++;
      });
      yCellCoord++;
      xCellCoord = 0;
    });
  }

  buildShips(id) {
    // sexy algorithm time
    
  }
}
