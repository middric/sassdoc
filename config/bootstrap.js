var fs = require('fs'),
	e = require('../config/exceptions.js');

module.exports = function (args, app) {
	if (args.length < 3) {
		throw new e.NotEnoughArgs();
	}

	return args[2];
};