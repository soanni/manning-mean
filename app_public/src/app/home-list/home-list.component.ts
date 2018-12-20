import { Component, OnInit } from '@angular/core';

export class Location {
	_id: string;
	name: string;
	distance: number;
	address: string;
	rating: number;
	facilities: string[];
}

@Component({
  selector: 'app-home-list',
  templateUrl: './home-list.component.html',
  styleUrls: ['./home-list.component.css']
})
export class HomeListComponent implements OnInit {

  constructor() { }

  location: Location = {
  	_id: '5c0e8e993aada07415e559ea',
  	name: 'Starcupss',
  	distance: 14.0,
  	address: 'High Street, Reading',
  	rating: 3,
  	facilities: ['hot drinks', 'food', 'power', 'girls']
  };

  ngOnInit() {
  }

}
