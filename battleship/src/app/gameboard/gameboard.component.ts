import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { DataService } from '../services/data.service';
import { AlertService } from '../services/alert.service';
import { CognitoService } from '../services/cognito.service';

import { GameInfo } from '../models/gameinfo';
import { BoardState } from '../models/boardstate';
import { ChallengeRecord } from '../models/challengeRecord'
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

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
    private boardId: number;
    private position: string = "horizontal";
    private hoverId: any;
    private shipSize: number = 5;
    private shipSizeList: number[] = [5,3,1];
    private playerTurn: boolean = false;
    private gameData: ChallengeRecord;
    private highLight: boolean = true;
    private shipsPlaced: boolean = false;
    private shipLocations: string[] = [];
    private getBoard;
    private showTurnMessage: boolean = true;
    public playerUsername: string = "";
    public oppPlayerUsername: string = "";

  constructor(private authService: AuthService,
    private router: Router,
    private dataService: DataService,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private cognitoService: CognitoService) { 
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

        this.cognitoService.getCurrentUser().then((data) => {
          this.playerUsername = data.username;
          this.route.queryParams.subscribe(params => {
            this.gameId = params.flim;
  
            this.dataService.getGameState(this.gameId).then((data) => {
              this.gameData = new ChallengeRecord(data[0]);
              this.boardId = this.gameData.board_id;

              var boardInfo = {
                "id" : this.boardId
              }
     
              if(this.playerUsername === this.gameData.player_1) {
                boardInfo['player'] = 1;
              }
              else {
                boardInfo['player'] = 2;
              }
  
              this.dataService.getBoardState(boardInfo).then((data) => {
                this.boardState = new BoardState(data[0]);

                if(this.playerUsername === this.gameData.player_1 && this.boardState.turn == 1) {
                  this.playerTurn = true;
                  this.oppPlayerUsername = this.gameData.player_2;
                }
                else {
                  this.oppPlayerUsername = this.gameData.player_1;
                }

                console.log(this.boardState);
                this.boardSetup();
                // after initial board setup, tell players to set their pieces
                this.alertService.setShipsAlert();
              })
              .catch((err) =>{
                console.log("Failure to retreive board state")
                console.log(err);
              });
            })
            .catch((err) => {
              console.log("Failure to retreive game state");
            });
          }, 
          (err) => {
            console.log("Failed to fill parameters in route");
          });
        })
        .catch((err) => {
          console.log("Failed to retrieve user info");
        })
      }
      else {
        this.router.navigate(['/login']);
      }
    });
  }

  ngOnDestroy() {
    if (this.getBoard) {
      clearInterval(this.getBoard);
    }
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
    this.boardState.board_state_obj.forEach(row => {
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
        cell.addEventListener("mouseover", this.highlightShipArea.bind(this));

        cell.addEventListener("mouseout", this.hideShipArea.bind(this));

        cell.addEventListener("click", () => {
          this.executeGame(cell.getAttributeNS(null, 'id'), this.shipSize).then((data) => {
            
            if(this.shipsPlaced === false) {
              if(data != null) { // then we want to permanently color the pieces and update the cell array

                if(this.shipsPlaced === false)  {
                  data.forEach(element => {
                    document.getElementById(element).setAttributeNS(null, 'name', 'spaceTaken');
                    document.getElementById(element).setAttributeNS(null, 'fill', '#9FA4A7');
                    this.shipLocations.push(element);
                  });
                }
  
                let curShip = this.shipSizeList.indexOf(this.shipSize);
  
                if(curShip >= 0 && curShip < this.shipSizeList.length - 1) {
                  this.shipSize = this.shipSizeList[curShip + 1]
                }
                else {
                  this.highLight = false;
                  this.shipsPlaced = true;

                  this.prepareBoard(this.shipLocations).then((data) => {
                    this.setShips();

                    this.getBoard = setInterval(() => {
                      this.updateGameInfoAndTurn(this.playerUsername);
                    }, 2000);
                    if(this.playerTurn === true) {
                      this.alertService.success("Your turn");
                    }
                  });
                }
              }
            }
            else {
              // ships are placed, updated board state, and turn identified, now what?
              this.updateGameInfoAndTurn(this.playerUsername);
              if(this.playerTurn === true) {
                this.fireMissile(cell.getAttributeNS(null, 'id')).then((data) => {
                  console.log("LAUNCH TORPEDO");
                  console.log(data);
                  if(data === "HIT") {
                    // tell client we hit
                    this.alertService.toastHit(true);
                    var explosion = document.createElementNS(this.svgns, 'image');
                    explosion.setAttributeNS(null, 'href', '../../assets/images/explosion.svg');
                    explosion.setAttributeNS(null, 'x', cell.getAttributeNS(null, 'x'));
                    explosion.setAttributeNS(null, 'y', cell.getAttributeNS(null, 'y'));
                    explosion.setAttributeNS(null, 'width', cell.getAttributeNS(null, 'width'));
                    explosion.setAttributeNS(null, 'height', cell.getAttributeNS(null, 'height'));
                    game.appendChild(explosion);
                  }
                  else {
                    // tell client we missed
                    this.alertService.toastHit(false);
                    var whiff = document.createElementNS(this.svgns, 'image');
                    whiff.setAttributeNS(null, 'href', '../../assets/images/smoke.png');
                    whiff.setAttributeNS(null, 'x', cell.getAttributeNS(null, 'x'));
                    whiff.setAttributeNS(null, 'y', cell.getAttributeNS(null, 'y'));
                    whiff.setAttributeNS(null, 'width', cell.getAttributeNS(null, 'width'));
                    whiff.setAttributeNS(null, 'height', cell.getAttributeNS(null, 'height'));
                    game.appendChild(whiff);
                  }
                  this.playerTurn = false;
                });
              }
              else {
                this.alertService.error("Not your turn you filthy animal");
              }
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

  checkWinCondition() {
    if(this.boardState.game_terminated != null && this.boardState.game_terminated != undefined) {
      if(this.boardState.game_terminated == 1) {
        clearInterval(this.getBoard);
        // only one person has to destroy the game

        // are we player 1?
        if(this.playerUsername === this.gameData.player_1) {
          
          this.alertService.playerWins(true).then((data) => {
            // destroy game
            this.destroyGame().then((data) => {
              // navigate back to lobby
              if(data != null && data != undefined) {
                this.router.navigate(['/lobby']);
              }
            });
          });
        }
        else {
          this.alertService.playerWins(false).then((data) => {
            this.router.navigate(['/lobby']);
          });
        }
      }
      else {
        clearInterval(this.getBoard);

        // are we player 2?
        if(this.playerUsername === this.gameData.player_2) {
          this.alertService.playerWins(true).then((data) => {
            // destroy game
            this.destroyGame().then((data) => {
              // navigate back to lobby
              if(data != null && data != undefined) {
                this.router.navigate(['/lobby']);
              }
            });
          });
        }
        else {
          this.alertService.playerWins(false).then((data) => {
            this.router.navigate(['/lobby']);
          });
        }
      }
    }
  }

  destroyGame(): Promise<any> {
    return new Promise((resolve) => {
      var newUserData = {
        players: { player_1: this.gameData.player_1, player_2: this.gameData.player_2},
        login: true,
        gameroom_id: 0
      }
      // update user
        this.dataService.updateUser(newUserData).then((userData) => {
          console.log("USER DATA UPDATED: ", userData);
          // delete game
          this.dataService.deleteGameById(this.gameId).then((gameData) => {
            console.log("GAME DATA DELETION: ", gameData);
            // delete board
            this.dataService.deleteBoard(this.boardId).then((boardData) => {
              console.log("BOARD DATA DELETION: ", boardData);
              resolve(true);
            });
          })
          .catch((err) => {
            console.log("failed to delete game upon game completion");
          })
        })
        .catch((err) => {
          console.log("failed to update user upon game completion");
        })
        
  
          
    });
  }

  fireMissile(missile):Promise<any> {
    return new Promise((resolve) => {
      var fireInfo = {};

      if(this.playerUsername == this.gameData.player_1) {
        fireInfo['board_num'] = 2;
        fireInfo['missile_coord'] = missile;
        fireInfo['id'] = this.boardId;
        this.dataService.updateBoardState(fireInfo).then((data) => {
          resolve(data);
        })
        .catch((err) => {
          console.log("Failed to fire missle. Fire Again!!!!");
        });
      }
      else {
        fireInfo['board_num'] = 1;
        fireInfo['missile_coord'] = missile;
        fireInfo['id'] = this.boardId;
        this.dataService.updateBoardState(fireInfo).then((data) => {
          resolve(data);
        })
        .catch((err) => {
          console.log("Failed to fire missle. Fire Again!!!!");
        });
      }
    });
  }

  updateGameInfoAndTurn(username) {
    this.dataService.getGameState(this.gameId).then((gameInfo) => {
      this.gameData = new ChallengeRecord(gameInfo[0]);

      var boardInfo = {
        id: gameInfo[0].board_id,
      }

      if(this.playerUsername === this.gameData.player_1) {
        boardInfo['player'] = 1;
      }
      else {
        boardInfo['player'] = 2;
      }

      this.dataService.getBoardState(boardInfo).then((boardData) => {
        this.boardState = new BoardState(boardData[0]);

        // check win status
        this.checkWinCondition();

        if((username == this.gameData.player_1 && this.boardState.turn == 1) || (username == this.gameData.player_2 && this.boardState.turn == 2)) {
          if(this.showTurnMessage) {
            this.alertService.success("Your Turn");
          }
          this.showTurnMessage = false;
          this.playerTurn = true;
        }
        else {
          this.showTurnMessage = true;
          this.playerTurn = false;
        }
      })
    })
    .catch((err) => {
      console.log("Something when wrong with getting turn");
    });

  }

  prepareBoard(shipCoordsList): Promise<any> {
    return new Promise((resolve) => {
      var body = this.boardState;
      
      // split the info into array, change what is needed, then put string back together and send it up
      if(this.playerUsername == this.gameData.player_1) {
        var splitBoard = this.boardState.board_state.split('');
        this.buildBoard(splitBoard, shipCoordsList).then((data) =>{
          body['player'] = '1';
          body.board_state = data;

          this.dataService.updateBoardState(body).then((data) => {
            resolve(data);
          });
        })
        .catch((err) => {
          console.log("Error occurred when building board");
        });
      }
      else {
        var splitBoard = this.boardState.board_state.split('');
        this.buildBoard(splitBoard, shipCoordsList).then((data) =>{
          body['player'] = '2';
          body.board_state = data;

          this.dataService.updateBoardState(body).then((data) => {
            resolve(data);
          });
        })
        .catch((err) => {
          console.log("Error occurred when building board");
        });
      }
    });
  }

  buildBoard(boardData, cellCoords): Promise<any> {
    return new Promise((resolve) => {
      var newBoardData = "";
      console.log(boardData);
      for(var i = 0; i < cellCoords.length; i++) {
        console.log(cellCoords[i]);
        boardData[cellCoords[i]] = "1";
      }
      boardData.forEach(element => {
        newBoardData += element.valueOf();
      });        
      resolve(newBoardData);
    });
  }

  highlightShipArea(event) {
    var cell = document.getElementById(event.path[0].id);
    this.hoverId = cell.getAttributeNS(null, 'id');
    this.showShipPlacement(cell.getAttributeNS(null, 'id'), this.shipSize, true);
  }

  hideShipArea(event) {
    var cell = document.getElementById(event.path[0].id);
    this.showShipPlacement(cell.getAttributeNS(null, 'id'), this.shipSize, false);
  }

  executeGame(id, shipSize): Promise<any> {
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
              shipArray.push(null);
            }
            else {
              shipArray.push(document.getElementById(shipPart).id);
            }

            shipPart = (Number(id) + (i + 1));
            if(shipPart%10 === 1) {
              this.alertService.error("Invalid Ship Placement");
              shipArray.push(null);
            }
            else {
              shipArray.push(document.getElementById(shipPart).id);
            }
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

        var cleanShip = true;
        shipArray.forEach(element => {
          // if we get a null value we know that the ship is not in a valid spot so we can't update the db just yet
          if(element != null) {
            return;
          }
          else {
            cleanShip = false;
            this.alertService.error("Invalid Ship Placement!");
            return;
          }
        });

        if(cleanShip) {
          resolve(shipArray);
        }
      }
      catch(err) {
        this.alertService.error("Invalid ship placement");
        resolve(null);
      }
    });


  }

  showShipPlacement(id, shipSize, visible) {
    if(this.highLight == false) {
      return;
    } 

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

  setShips() {
    this.shipLocations.forEach((shipCell) => {
      document.getElementById(shipCell).setAttributeNS(null, 'fill', '#87C540');
    });
  }

  getOpposingPlayerBoard() {

  }
}
