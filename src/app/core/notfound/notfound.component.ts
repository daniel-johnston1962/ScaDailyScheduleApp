import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notfound',
  templateUrl: './notfound.component.html',
  styleUrls: ['./notfound.component.css']
})
export class NotfoundComponent implements OnInit {
  public warningMessage: string = "Sorry this page could not be found... Please select from the menu";

  constructor() { }

  ngOnInit() {
  }

}
