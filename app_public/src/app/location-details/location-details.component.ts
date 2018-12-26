import { Component, OnInit, Input } from '@angular/core';
import { Location } from '../home-list/home-list.component';

@Component({
  selector: 'app-location-details',
  templateUrl: './location-details.component.html',
  styleUrls: ['./location-details.component.css']
})
export class LocationDetailsComponent implements OnInit {
  @Input() location: Location;

  public formVisible: boolean = false;

  public formError: string;
  
  public newReview = {
    author: '',
    rating: 5,
    reviewText: ''
  };

  private formIsValid(): boolean {
    if (this.newReview.author && this.newReview.rating && this.newReview.reviewText) {
    	return true;
    } else {
	return false;
    }
  }

  public onReviewSubmit(): void {
    this.formError = '';
    if (this.formIsValid()) {
    	console.log(this.newReview);
    } else {
	this.formError = 'All fields required, please try again';
    }
  }

  constructor() { }

  ngOnInit() {
  }

}
