const express = require('express'),
	router = express.Router(),
	ctrlLocations = require('../controllers/locations'),
	ctrlOthers = require('../controllers/others');

/* Locations pages */
router.get('/', ctrlLocations.homelist);
router.get('/location/:locationid', ctrlLocations.locationInfo);
router
  .route('/location/:locationid/review/new')
  .get(ctrlLocations.addReview)
  .post(ctrlLocations.doAddReview);

/* Other pages */
router.get('/about', ctrlOthers.about);

module.exports = router;
