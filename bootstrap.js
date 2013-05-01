var fs = require('fs'),
	error = function (str) {
		var red = '\033[31m',
			reset = '\033[0m';
		console.error(red + str + reset);
		process.exit();
	}

module.exports = {
	validateArgs: function (args) {
		if (args.length < 3) {
			error('Not enough arguments');
		}
	},

	setConfig: function (file) {
		if (!fs.existsSync(file)) {
			error('Configuration file: \n\t"' + file + '"\ndoes not exist');
		}
		var data = fs.readFileSync(file);
		return JSON.parse(data.toString());
	}
};