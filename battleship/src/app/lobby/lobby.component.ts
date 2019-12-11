import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { CognitoService } from '../services/cognito.service';
import { AlertService } from '../services/alert.service';
import { ChallengeRecord } from '../models/challengeRecord';


@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss']
})
export class LobbyComponent implements OnInit {

  public user: string; 
  private challengers: ChallengeRecord[] = [];
  private challengerHeartbeat;

  constructor(
    private authService: AuthService, 
    private router: Router, 
    private dataService: DataService, 
    private cognitoService: CognitoService, 
    private alertService: AlertService) 
    { }

  ngOnInit() {

    this.authService.isAuthenticated().then((data) => {
      if(data == true) {
        return;
      }
      else {
        this.router.navigate(['/login']);
      }
    });

    this.cognitoService.getCurrentUser().then((data) => {
      this.user = data.username;

      // this.challengerHeartbeat = setInterval(() => {
      this.checkChallenges();
      // }, 5000);
    });
  }

  ngOnDestroy() {
    if (this.challengerHeartbeat) {
      clearInterval(this.challengerHeartbeat);
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

      console.log("LOGOOUT DATA: ", logoutData);

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

  requestChallenge(gameData) {
    this.dataService.createGame(gameData).subscribe((data) => {},
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
            queryParams: { board_id: gameDataStart.board_id }
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
