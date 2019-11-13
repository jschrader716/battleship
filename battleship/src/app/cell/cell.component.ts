import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss']
})

export class CellComponent implements OnInit {

  public size: number = 10;
  public row: number = 0;
  public col: number = 0;
  public id: string = "";
  public parent;
  public y;
  public x;

  constructor() {
    // this.parent = parent;
    //initialize other instance vars
    //this.occupied=''; //hold the id of the piece
    this.y = this.size*this.row;
    this.x = this.size*this.col;
        // this.myBBox = this.getMyBBox();
   }

  ngOnInit() {
  }
}
