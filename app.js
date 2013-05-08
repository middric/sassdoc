var express = require('express'),
	path = require('path'),
	sass = require('node-sass'),
	app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.use(sass.middleware({
	src: __dirname + '/public/sass',
	dest: __dirname + '/public',
	debug: true,
	outputStyle: 'compressed',
	include_paths: [__dirname + '/public/sass/stylesheets/']
}));
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.set('configuration', require('./config/bootstrap.js')(process.argv, app));
require('./config/server.js')(app);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
require('./config/routes.js')(app);