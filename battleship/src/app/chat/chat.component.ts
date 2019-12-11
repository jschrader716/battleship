import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { DataService } from '../services/data.service';
import { AlertService } from '../services/alert.service'
import { CognitoService } from '../services/cognito.service';
import { Message } from '../models/message'
import { element } from 'protractor';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  public messages: Message[] = [];
  public users: string[] = [];
  private messengerHeartbeat;

  @Output() challengeOpponent = new EventEmitter();

  constructor(private dataService: DataService, private alertService: AlertService, private cognitoService: CognitoService) { }

  ngOnInit() {
    this.getAllMessages();
  }

  ngOnDestroy() {
    if (this.messengerHeartbeat) {
      clearInterval(this.messengerHeartbeat);
    }
  }

  sendMsg(key) {
    if(key.keyCode == 13 && key != '') {
      this.cognitoService.getCurrentUser().then((user) => {
        var message = (<HTMLInputElement>document.getElementById('chatMsg')).value;

        this.dataService.getUser(user.username).then((userData) => {
          console.log(userData);
          var data = {
            username: user.username,
            game_id: userData[0].gameroom_id,
            message: message
          }
    
          this.dataService.sendMessage(data);
          //clear message
          (<HTMLInputElement>document.getElementById('chatMsg')).value = '';
        })
        .catch((err) => {
          console.log("Something went wrong when sending messages: ", err);
        });
      });
    }
  }

  getAllMessages() {
      let game_id: number;
      this.cognitoService.getCurrentUser().then((user) => {

        this.dataService.getUser(user.username).then((userData) => {
          game_id = userData[0].gameroom_id;
        })
        .catch((err) => {
          console.log("Error when grabbing user info in chat");
        })

        // this.messengerHeartbeat = setInterval(() => { 
          this.messages = [];
          var chatString = "";
          
          this.dataService.getAllMessages(user.username).then((data) => {
            this.messages = data;
            this.messages.forEach(element => {
              chatString += element.username + ': ' + element.message + '\n'; 
              document.getElementById('chat-area').innerHTML = chatString;
              document.getElementById('chat-area').scrollTop = document.getElementById('chat-area').scrollHeight;
            });
            console.log(game_id);
            this.buildUserList(game_id);
          });
        // }, 2000);

      })
      .catch((err) => {
        console.log("Failure in chat component while attempting to retrieve messages.");
      });
  }

  buildUserList(gameroom_id) {
    this.dataService.getActiveUsers(gameroom_id).then((data) => {
      this.users = data;
    });
  }

  challenge(user) {
    var curUser = this.cognitoService.getCurrentUser().then((userData) => {
      // if(user.username != userData.username) {

        let gameData = {
          player_1: user.username, // challengee
          player_2: userData.username // challanger
        }

        this.challengeOpponent.emit(gameData);
      // }
    });
  }
}
