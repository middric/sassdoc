var fs = require('fs'),
	e = require('../config/exceptions.js');

module.exports = function (args, app) {
	if (args.length < 3) {
		throw new e.NotEnoughArgs();
	}

	if (!fs.existsSync(args[2])) {
		throw new e.FileDoesNotExist();
	}

	var data = fs.readFileSync(args[2]),
		json;
	try {
		json = JSON.parse(data.toString());
	} catch (err) {
		throw new e.InvalidJSONFile();
	}
	return json;
};