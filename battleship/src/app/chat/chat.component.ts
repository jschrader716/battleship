import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { AlertService } from '../services/alert.service'

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  constructor(private dataService: DataService, private alertService: AlertService) { }

  ngOnInit() {
  }

  sendMsg(msg) {
    if(msg.keyCode == 13) {
      let msg = (<HTMLInputElement>document.getElementById('chatMsg')).value;
      console.log(msg);
      //clear message
      (<HTMLInputElement>document.getElementById('chatMsg')).value = '';
    }
  }

  getAllMessages() {
    this.dataService.getAllMessages().subscribe((data) => {
      console.log(data);
    },
    (error) => {
      this.alertService.error("Something went terribly wrong...send help..." + error);
    });
  }
}
