var path = require('path'),
	sass = require('node-sass');

module.exports = function (app, express) {
	app.configure(function () {
		// all environments
		app.set('port', process.env.PORT || 3000);
		app.set('views', __dirname + '/views');
		app.set('view engine', 'ejs');
		app.use(sass.middleware({
			src: __dirname + '/public/sass',
			dest: __dirname + '/public',
			debug: true,
			outputStyle: 'compressed'
		}));
		app.use(express.favicon());
		app.use(express.logger('dev'));
		app.use(express.bodyParser());
		app.use(express.methodOverride());
		app.use(app.router);
		app.use(express.static(path.join(__dirname, 'public')));
	})

	// development only
	if ('development' == app.get('env')) {
	  app.use(express.errorHandler());
	}
};