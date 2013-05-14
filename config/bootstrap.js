var fs = require('fs'),
	e = require('../config/exceptions.js');

module.exports = function (args, app) {
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
	json.root = fs.realpathSync(args[2]);
	json.root = json.root.replace(/(.*)\/.+\.json$/i, '$1');
	return json;
};