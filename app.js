var express = require('express'),
	app = express();

require('./config/environment.js')(app, express);
require('./config/bootstrap.js')(app);
require('./config/server.js')(app);
require('./config/routes.js')(app);


// Debug code
var execSync = require('execSync');
var output = execSync.stdout("echo 'body{background:red}' | sass -s --scss --compass");
console.log(output);