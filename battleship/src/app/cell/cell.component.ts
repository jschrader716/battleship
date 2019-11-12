import { Component, OnInit, Input } from '@angular/core';
import { Injectable } from '@angular/core';

@Component({
  selector: 'cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss']
})

export class CellComponent implements OnInit {

  @Input() size: number;
  @Input() row: number;
  @Input() col: number;
  @Input() id: string;
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
