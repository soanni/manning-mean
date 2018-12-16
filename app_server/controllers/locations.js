const request = require('request');
const apiOptions = {
	server: 'http://localhost:3000'
};

const formatDistance = (distance) => {
	let thisDistance = 0;
	let unit = 'm';
	if (distance > 1000) {
		thisDistance = parseFloat(distance / 1000).toFixed(1);
		unit = 'km';
	} else {
		thisDistance = Math.floor(distance);
	}
	return thisDistance + unit;
};

const renderHomepage = (req, res, responseBody) => {
	let message = null;
	if (!(responseBody instanceof Array)) {
		message = "API lookup error";
		responseBody = [];
	} else {
		if (!responseBody.length) {
			message = "No places found nearby";
		}
	}
	res.render('locations-list', {
		title: 'Loc8r - find a place to work with wifi',
        	pageHeader: {
			title: 'Loc8r',
			strapline: 'Find places to work with wifi near you!'
        	},
        	sidebar: 'Loc8r helps you to find places to work when out and about.',
		locations: responseBody,
		message
	});
};

const renderDetailPage = (req, res, location) => {
	res.render('location-info', {
		title: location.name,
		pageHeader: {
			title: location.name
		},
		sidebar: {
			context: 'is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.',
			callToAction: 'If you\'ve been and you like it - or if you don\'t - please leave a review to help other people just like you.'
		},
		location
	});
};
		

/* GET 'home' page */
const homelist = (req, res) => {
	const path = '/api/locations';
	const requestOptions = {
		url: `${apiOptions.server}${path}`,
		method: 'GET',
		json: {},
		qs: {
			lng: -0.9580780,
			lat: 51.444130,
			//lng: 0,
			//lat: 0,
			maxDistance: 20
		}
	};
	request(requestOptions, (err, {statusCode}, body) => {
		let data = [];
		if (statusCode === 200 && body.length) {
			data = body.map((item) => {
				item.distance = formatDistance(item.distance);
				return item;
			});
		}
		renderHomepage(req, res, data);
	});
};

/* GET 'Location info' page */
const locationInfo = (req, res) => {
	const path = `/api/locations/${req.params.locationid}`;
	const requestOptions = {
		url: `${apiOptions.server}${path}`,
		method: 'GET',
		json: {}
	};
	request(requestOptions, (err, response, body) => {
		const data = body;
		console.log(data);
		data.coords = {
			lng: body.coords[0],
			lat: body.coords[1]
		};
		renderDetailPage(req, res, data); 
	});
};

/* GET 'Add review' page */
const addReview = (req, res) => {
	res.render('location-review-form', {title: 'Add review'});
};

const doAddReview = (req, res) => {
};

module.exports = {
	homelist,
	locationInfo,
	addReview,
	doAddReview
};
