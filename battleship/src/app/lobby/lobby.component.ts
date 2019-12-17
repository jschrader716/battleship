import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { CognitoService } from '../services/cognito.service';
import { AlertService } from '../services/alert.service';
import { ChallengeRecord } from '../models/challengeRecord';
import { NgxUiLoaderService } from 'ngx-ui-loader';


@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss']
})
export class LobbyComponent implements OnInit {

  public user: string; 
  private challengers: ChallengeRecord[] = [];
  private challengerHeartbeat;
  private checkChallengeResponse;

  constructor(
    private authService: AuthService, 
    private router: Router, 
    private dataService: DataService, 
    private cognitoService: CognitoService, 
    private alertService: AlertService,
    private ngxService: NgxUiLoaderService) 
    { }

  ngOnInit() {
    this.authService.isAuthenticated().then((data) => {
      if(data == true) {
        this.ngxService.start();

        this.cognitoService.getCurrentUser().then((data) => {
          console.log(data);
          this.user = data.username;

          var setUserToLobby = {
            login: true,
            username: this.user,
            gameroom_id: 0
          }
          this.dataService.updateUser(setUserToLobby).then(() => {
            this.checkChallengeResponse = setInterval(() => {
              this.dataService.getChallengeResponses(this.user).then((gameDataStart: any) => {
                // someone somewhere in the world must have accepted the game
                if(gameDataStart.length > 0) {
                  var newUserData = {
                    username: this.user,
                    login: true,
                    gameroom_id: gameDataStart[0].id
                  }
      
                  this.dataService.updateUser(newUserData).then(() => {
                    this.router.navigate(['/game'], {
                      // forgive my crappy attempt to obfuscate some data from the user hahaha
                      queryParams: { flim: gameDataStart[0].id }
                    });
                  })
                }
              });
            }, 2000);
          });
  
          setTimeout(() => {
            this.ngxService.stop();
          }, 2000);
    
          this.challengerHeartbeat = setInterval(() => {
            this.checkChallenges();
          }, 5000);
        });
      }
      else {
        this.router.navigate(['/login']);
      }
    });
  }

  ngOnDestroy() {
    if (this.challengerHeartbeat) {
      clearInterval(this.challengerHeartbeat);
    }
    if (this.checkChallengeResponse) {
      clearInterval(this.checkChallengeResponse);
    }
  }

  logout() {
    var user = this.cognitoService.getCurrentUser().then((data) => {

      var logoutData = {
        username: data.username,
        login: false,
        wins: 0,
        losses: 0,
        gameroom_id: null
      }

      this.dataService.deleteAllGames(data.username).then(() => {
        this.dataService.updateUser(logoutData).then((data) => {
          this.authService.logout().then((data) => {
            this.router.navigate(['/login']);
          })
          .catch((err) => {
            console.log("Failure to logout user in cognito.");
          });
        })
        .catch((err) => {
          console.log("Failure to update user in db.");
        });
      })
      .catch((err) => {
        console.log("Failure to delete user's games.");
      });
    });

  }

  // called when user is clicked on in chat list
  requestChallenge(gameData) {
    this.dataService.createGame(gameData).subscribe((data) => {
      this.alertService.toastMessageSuccess("Game Invite Sent");
    },
    (err) => {
      console.log("Failed to create game");
    })
  }
  
  checkChallenges() {
    this.dataService.getChallenges(this.user).then((newChallengers: ChallengeRecord[]) => {
      newChallengers.forEach(element => {
        var challengerFound = this.challengers.some(challenger => challenger.player_2 === element.player_2);
        
        if(!challengerFound) {
          this.challengers.push(element);
        }
      });

      this.challengers.forEach(element => {
        this.alertService.challengeAlert(element.player_2).then((decision) => {
          if(decision === true) {
            this.acceptChallenge(element);
          }
          else {
            this.declineChallenge(element.id);
          }
        });
      });
    });
  }

  declineChallenge(gameId) {
    this.dataService.deleteGameById(gameId).then((data) => {
      // iterates through challenger list and checks if the index id attribute are the same then remove that shit
      this.challengers.forEach(element => {
        if(element.id === gameId) {
          this.challengers.splice( this.challengers.indexOf(element), 1 );
        }
      });
    });
  }

  acceptChallenge(gameDataStart) {
    // create the board record first and then update the game record
    this.challengers = [];
    this.dataService.createBoard().subscribe((data: any) => {
      gameDataStart.board_id = data.insertId;

      this.dataService.updateGameState(gameDataStart).then((data) => {

        var newUserData = {
          username: this.user,
          login: true,
          gameroom_id: gameDataStart.id
        }

        this.dataService.updateUser(newUserData).then(() => {
          this.router.navigate(['/game'], {
            // forgive my crappy attempt to obfuscate some data from the user hahaha
            queryParams: { flim: gameDataStart.id }
          });
        })
        .catch((err) => {
          console.log("Failed to update user to new game state: ", err)
        });
      })
      .catch((err) => {
        console.log("You're so bad that nobody wants to play with you");
      });
    })
  }
}
