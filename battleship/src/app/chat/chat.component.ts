import { Component, OnInit, ViewChild } from '@angular/core';
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

  constructor(private dataService: DataService, private alertService: AlertService, private cognitoService: CognitoService) { }

  ngOnInit() {
    this.getAllMessages();
  }

  sendMsg(key) {
    if(key.keyCode == 13 && key != '') {
      this.cognitoService.getCurrentUser().then((user) => {
        var message = (<HTMLInputElement>document.getElementById('chatMsg')).value;
  
        var data = {
          username: user.username,
          game_id: 0,
          message: message
        }
  
        this.dataService.sendMessage(data);
        //clear message
        (<HTMLInputElement>document.getElementById('chatMsg')).value = '';
      });
    }
  }

  getAllMessages() {
    // setInterval(() => { 
      this.messages = [];
      var chatString = "";
      this.dataService.getAllMessages().then((data) => {
        this.messages = data;
        this.messages.forEach(element => {
          chatString += element.username + ': ' + element.message + '\n'; 
          document.getElementById('chat-area').innerHTML = chatString;
          document.getElementById('chat-area').scrollTop = document.getElementById('chat-area').scrollHeight;
        });
        this.buildUserList(0);
      });
    // }, 2000);
  }

  buildUserList(gameroom_id) {
    this.dataService.getActiveUsers(0).then((data) => {
      this.users = data;
    });
  }

  challenge() {
    this.alertService.success("A challenger approaches!");
  }
}
