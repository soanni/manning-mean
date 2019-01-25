const apm = require('elastic-apm-node').start({
	serviceName: 'loc8r',
	serverUrl: 'http://10.25.33.74:8200',
	logLevel: 'trace',
	captureBody: 'all'
});
const createError = require('http-errors'),
	express = require('express'),
	path = require('path'),
	cookieParser = require('cookie-parser'),
	logger = require('morgan'),
//	indexRouter = require('./app_server/routes/index'),
	app = express(),
	passport = require('passport');
require('./app_api/models/db');
const apiRouter = require('./app_api/routes/index');
require('./app_api/config/passport');

// view engine setup
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'app_public', 'build')));
app.use(passport.initialize());
app.use('/api', (req, res, next) => {
	// res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
	next();
});

//app.use('/', indexRouter);
app.use('/api', apiRouter);
app.get(/(\/register)|(\/login)|(\/about)|(\/location\/[a-z0-9]{24})/, function(req, res, next) {
	res.sendFile(path.join(__dirname, 'app_public', 'build', 'index.html'));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.use((err, req, res, next) => {
	if (err.name === 'UnauthorizedError') {
		res.status(401)
		   .json({"message": err.name + ": " + err.message});
	}
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
