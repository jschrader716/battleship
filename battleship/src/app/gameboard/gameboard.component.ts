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
    private position: string = "horizontal";
    private hoverId: any;
    private shipSize: number = 5;
    private shipSizeList: number[] = [5,3,1]

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

    this.shipSize = this.shipSizeList[0];

    document.addEventListener('keypress', (keypress) => {
      if(keypress.keyCode == 114) {
        (this.position === 'horizontal') ? this.position = 'vertical' : this.position = 'horizontal'; 
        
        this.wipeHoverShip(this.hoverId, this.position, this.shipSize);
        this.showShipPlacement(this.hoverId, this.shipSize, true);
      }
    });

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

        // foundation functions for building ships

        cell.addEventListener("mouseover", () => {
          this.hoverId = cell.getAttributeNS(null, 'id');
          this.showShipPlacement(cell.getAttributeNS(null, 'id'), this.shipSize, true);
        });

        cell.addEventListener("mouseout", () => {
          this.showShipPlacement(cell.getAttributeNS(null, 'id'), this.shipSize, false);
        })

        cell.addEventListener("click", () => {
          this.buildShips(cell.getAttributeNS(null, 'id'), this.shipSize).then((data) => {
            if(data != null) { // then we want to permanently color the pieces
              let curShip = this.shipSizeList.indexOf(this.shipSize);
              if(curShip >= 0 && curShip < this.shipSizeList.length - 1) {
                this.shipSize = this.shipSizeList[curShip + 1]
              }
              else {
                // we placed all out ships and need to do something else
              }
            }
            else {

            }
          });
        })
        
        document.getElementsByTagName('g')[0].appendChild(cell);
        xCellCoord++;
        cellId++;
      });
      yCellCoord++;
      xCellCoord = 0;
    });
  }

  buildShips(id, shipSize): Promise<any> {
    // sexy algorithm time
    // here we will check if they are in a valid position to place a ship
    // once a ship is placed, interate to the next one and use same logic with different length
    return new Promise((resolve) => {
      try {

        var shipArray = [];
        var halfShipLength = Math.floor(shipSize/2);
        var shipPart = id;

        if(this.position === 'horizontal') {
          shipArray.push(document.getElementById(shipPart).id);

          for(var i = 0; i < halfShipLength; i++) {
            shipPart = (Number(id) - (i + 1));
            if(shipPart%10 === 0) {
              this.alertService.error("Invalid Ship Placement");
              resolve(null);
            }
            shipArray.push(document.getElementById(shipPart).id);

            shipPart = (Number(id) + (i + 1));
            if(shipPart%10 === 1) {
              this.alertService.error("Invalid Ship Placement");
              resolve(null);
            }
            shipArray.push(document.getElementById(shipPart).id);
          }
        }
        else {
          shipArray.push(document.getElementById(shipPart).id);

          for(var i = 0; i < halfShipLength; i++) {
            shipPart = (Number(id) - ((i + 1) * 10));
            shipArray.push(document.getElementById(shipPart).id);

            shipPart = (Number(id) + ((i + 1) * 10));
            shipArray.push(document.getElementById(shipPart).id);
          }
        }

        shipArray.forEach(element => {
          // if we get a null value we know that the ship is not in a valid spot so we can't update the db just yet
          if(element == null) {
            this.alertService.error("Invalid Ship Placement!");
            resolve(null);
          }
          else {
            document.getElementById(element).setAttributeNS(null, 'name', 'spaceTaken');
            document.getElementById(element).setAttributeNS(null, 'fill', '#9FA4A7');
          }
        });

        resolve(shipArray);
      }
      catch(err) {
        this.alertService.error("Invalid ship placement");
        resolve(null);
      }
    });


  }

  showShipPlacement(id, shipSize, visible) {
    try {
      var halfShipLength = Math.floor(shipSize/2);

      if(visible) {
        if(shipSize == 1) {
          if(document.getElementById(id).getAttributeNS(null, 'name') != 'spaceTaken') {
            document.getElementById(id).setAttributeNS(null, 'fill', 'red');
          }
        }
        else {
          if(this.position === 'horizontal') {
            for(var i = 0; i < halfShipLength; i++) {
              if(document.getElementById(id).getAttributeNS(null, 'name') != 'spaceTaken') {
                document.getElementById(id).setAttributeNS(null, 'fill', 'red');
              }
              if(document.getElementById((Number(id) - (i + 1)).toString()).getAttributeNS(null, 'name') != 'spaceTaken') {
                document.getElementById((Number(id) - (i + 1)).toString()).setAttributeNS(null, 'fill', 'red');
              }
              if(document.getElementById((Number(id) + (i + 1)).toString()).getAttributeNS(null, 'name') != 'spaceTaken') {
                document.getElementById((Number(id) + (i + 1)).toString()).setAttributeNS(null, 'fill', 'red');
              }
            }
          }
          else {
            for(var i = 0; i < halfShipLength; i++) {
              if(document.getElementById(id).getAttributeNS(null, 'name') != 'spaceTaken') {
                document.getElementById(id).setAttributeNS(null, 'fill', 'red');
              }
              if(document.getElementById((Number(id) - ((i + 1) * 10)).toString()).getAttributeNS(null, 'name') != 'spaceTaken') {
                document.getElementById((Number(id) - ((i + 1) * 10)).toString()).setAttributeNS(null, 'fill', 'red');
              }
              if(document.getElementById((Number(id) + ((i + 1) * 10)).toString()).getAttributeNS(null, 'name') != 'spaceTaken') {
                document.getElementById((Number(id) + ((i + 1) * 10)).toString()).setAttributeNS(null, 'fill', 'red');
              }
            }
          }
        }
      }
      else {
        if(shipSize == 1) {
          if(document.getElementById(id).getAttributeNS(null, 'name') != 'spaceTaken') {
            document.getElementById(id).setAttributeNS(null, 'fill', '#55697A');
          }
        }
        else {
          if(this.position === 'horizontal') {
            for(var i = 0; i < halfShipLength; i++) {
              if(document.getElementById(id).getAttributeNS(null, 'name') != 'spaceTaken') {
                document.getElementById(id).setAttributeNS(null, 'fill', '#55697A');
              }
              if(document.getElementById((Number(id) - (i + 1)).toString()).getAttributeNS(null, 'name') != 'spaceTaken') {
                document.getElementById((Number(id) - (i + 1)).toString()).setAttributeNS(null, 'fill', '#55697A');
              }
              if(document.getElementById((Number(id) + (i + 1)).toString()).getAttributeNS(null, 'name') != 'spaceTaken') {
                document.getElementById((Number(id) + (i + 1)).toString()).setAttributeNS(null, 'fill', '#55697A');
              }
            }
          }
          else {
            for(var i = 0; i < halfShipLength; i++) {
              if(document.getElementById(id).getAttributeNS(null, 'name') != 'spaceTaken') {
                document.getElementById(id).setAttributeNS(null, 'fill', '#55697A');
              }
              if(document.getElementById((Number(id) - ((i + 1) * 10)).toString()).getAttributeNS(null, 'name') != 'spaceTaken') {
                document.getElementById((Number(id) - ((i + 1) * 10)).toString()).setAttributeNS(null, 'fill', '#55697A');
              }
              if(document.getElementById((Number(id) + ((i + 1) * 10)).toString()).getAttributeNS(null, 'name') != 'spaceTaken') {
                document.getElementById((Number(id) + ((i + 1) * 10)).toString()).setAttributeNS(null, 'fill', '#55697A');
              }
            }
          }
        }
      }
    }
    catch(err) {}
  }

  wipeHoverShip(id, position, shipSize) {
    try {
      var halfShipLength = Math.floor(shipSize/2);
      if(position === 'horizontal') {
        for(var i = 0; i < halfShipLength; i++) {
          document.getElementById(id).setAttributeNS(null, 'fill', 'red');
          document.getElementById((Number(id) - ((i + 1) * 10)).toString()).setAttributeNS(null, 'fill', '#55697A');
          document.getElementById((Number(id) + ((i + 1) * 10)).toString()).setAttributeNS(null, 'fill', '#55697A');
        }
      }
      else {
        for(var i = 0; i < halfShipLength; i++) {
          document.getElementById(id).setAttributeNS(null, 'fill', 'red');
          document.getElementById((Number(id) - (i + 1)).toString()).setAttributeNS(null, 'fill', '#55697A');
          document.getElementById((Number(id) + (i + 1)).toString()).setAttributeNS(null, 'fill', '#55697A');
        }
      }
    }
    catch(err) {

    }
  }
}
