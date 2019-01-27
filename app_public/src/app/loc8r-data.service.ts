import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Location, Review } from './location';
import { User } from './user';
import { Authresponse } from './authresponse';
import { BROWSER_STORAGE } from './storage';

import { init as initApm } from 'elastic-apm-js-base';

@Injectable({
  providedIn: 'root'
})
export class Loc8rDataService {

	constructor(private http: HttpClient, @Inject(BROWSER_STORAGE) private storage: Storage) { 
		this.apm = initApm({
		  serviceName: 'loc8r-angular',
		  serverUrl: 'http://10.25.33.74:8200'
		});
		this.transaction = this.this.apm.startTransaction('loc8r-data.service', 'custom');
	}

	// Elastic APM RUM
	private apm;
	private transaction;
	private httpSpan;

	//private apiBaseUrl = 'http://localhost:3000/api';
	private apiBaseUrl = 'http://10.25.33.74:8090/api';

	public addReviewByLocationId(locationId: string, formData: Review): Promise<Review> {
		const url: string = `${this.apiBaseUrl}/locations/${locationId}/reviews`;
		const httpOptions = {
			headers: new HttpHeaders({'Authorization': `Bearer ${this.storage.getItem('loc8r-token')}`})
		};

		this.httpSpan = this.transaction.startSpan('Custom POST ' + url, 'http');

		return this.http
			.post(url, formData, httpOptions)
			.toPromise()
			.then((response) => {
				this.httpSpan.end();
    			this.transaction.end();
				return response as Review;
			})
			.catch(this.handleError);
	}

	public getLocations(lat: number, lng: number): Promise<Location[]> {
		//const lng: number = -0.9580780;
		//const lat: number = 51.444130;
		const maxDistance: number = 20;
		const url: string = `${this.apiBaseUrl}/locations?lng=${lng}&lat=${lat}&maxDistance=${maxDistance}`;

		this.httpSpan = this.transaction.startSpan('Custom GET ' + url, 'http');

		return this.http
			.get(url)
			.toPromise()
			.then((response) => {
				this.httpSpan.end();
    			this.transaction.end();
				return response as Location[]
			})
			.catch(this.handleError);
	}
	
	public getLocationById(locationId: string): Promise<Location> {
		const url: string = `${this.apiBaseUrl}/locations/${locationId}`;

		this.httpSpan = this.transaction.startSpan('Custom GET ' + url, 'http');

		return this.http
			.get(url)
			.toPromise()
			.then((response) => {
				this.httpSpan.end();
    			this.transaction.end();				
				response as Location;
			})
			.catch(this.handleError)	
	}
	
	public login(user: User): Promise<Authresponse> {
		return this.makeAuthApiCall('login', user);
	}

	public register(user: User): Promise<Authresponse> {
		return this.makeAuthApiCall('register', user);
	}

	private makeAuthApiCall(urlPath: string, user: User): Promise<Authresponse> {
		const url: string = `${this.apiBaseUrl}/${urlPath}`;

		this.httpSpan = this.transaction.startSpan('Custom POST ' + url, 'http');		

		return this.http
			.post(url, user)
			.toPromise()
			.then((response) => {
				this.httpSpan.end();
    			this.transaction.end();
				return response as Authresponse;
			})
			.catch(this.handleError)
	}

	private handleError(error: any): Promise<any> {
		this.apm.captureError(new Error(`Custom POST/GET failed with status ${error.message}`));
		this.httpSpan.end();
    	this.transaction.end();

		console.error('Something has gone wrong', error);
		return Promise.reject(error.message || error);	
	}

}
