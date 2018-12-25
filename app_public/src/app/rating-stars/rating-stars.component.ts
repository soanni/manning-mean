import { Component, OnInit, Input } from '@angular/core';
import { Location } from '../home-list/home-list.component';

@Component({
  selector: 'app-rating-stars',
  templateUrl: './rating-stars.component.html',
  styleUrls: ['./rating-stars.component.css']
})
export class RatingStarsComponent implements OnInit {
  @Input() thisRating: number;

  constructor() { }

  ngOnInit() {
  }

}
