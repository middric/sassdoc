var express = require('express'),
	routes = require('./routes'),
	http = require('http'),
	path = require('path'),
	sass = require('node-sass'),
	execSync = require('execSync'),
	bootstrap = require('./bootstrap'),
	app = express();

bootstrap.validateArgs(process.argv);

app.configure(function () {
	// all environments
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	app.set('configuration', bootstrap.setConfig(process.argv[2]));
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

app.get('/', routes.index);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var output = execSync.stdout("echo 'body{background:red}' | sass -s --scss --compass");
console.log(output);