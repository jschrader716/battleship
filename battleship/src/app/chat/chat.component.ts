import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { AlertService } from '../services/alert.service'
import { CognitoService } from '../services/cognito.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  public messages: [] = [];

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
    //setInterval(() => { 
      this.dataService.getAllMessages().then((data) => {
        console.log(data);
      });
    //}, 3000);
  }
}
