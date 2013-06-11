var express = require('express'),
	path = require('path'),
	app = express();

// all environments
app.set('port', process.env.npm_package_config_port || 3000);
app.set('views', __dirname + '/views');
app.engine('.html', require('jade').__express);
app.set('view engine', 'jade');
app.set('view options', {layout: false});
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
if (app.get('configuration').debug) {
	process.env.debug = true;
}
require('./config/server.js')(app);

require('./config/routes.js')(app);