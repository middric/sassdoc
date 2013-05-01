var fs = require('fs'),
	red = '\033[31m',
	reset = '\033[0m';

module.exports = {
	validateArgs: function (args) {
		if (args.length < 3) {
			throw red + 'Not enough arguments' + reset;
		}
	},

	setConfig: function (file) {
		if (!fs.existsSync(file)) {
			throw red + 'Configuration file: \n\t"' + file + '"\ndoes not exist' + reset;
		}
		var data = fs.readFileSync(file);
		return JSON.parse(data.toString());
	}
};