var express = require('express'),
	app = express();

require('./config/environment.js')(app, express);
require('./config/bootstrap.js')(process.argv, app);
require('./config/server.js')(app);
require('./config/routes.js')(app);