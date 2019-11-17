import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service'

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  sendMsg(msg) {
    if(msg.keyCode == 13) {
      let msg = (<HTMLInputElement>document.getElementById('chatMsg')).value;
      console.log(msg);
    }
  }

}
