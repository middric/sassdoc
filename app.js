var express = require('express'),
	path = require('path'),
	sass = require('node-sass'),
	app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.use(sass.middleware({
	src: __dirname + '/public/sass',
	dest: __dirname + '/public',
	debug: false,
	outputStyle: 'compressed'
}));
app.set('views', __dirname + '/views');
app.engine('.html', require('jade').__express);
app.set('view engine', 'jade');
app.set('view options', {layout: false});
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

require('./config/routes.js')(app);