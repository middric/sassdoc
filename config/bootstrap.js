var fs = require('fs'),
	error = function (str) {
		var red = '\033[31m',
			reset = '\033[0m';
		console.error(red + str + reset);
		process.exit();
	}

module.exports = function (app) {
	if (process.argv.length < 3) {
		error('Not enough arguments');
	}

	if (!fs.existsSync(process.argv[2])) {
		error('Configuration file: \n\t"' + process.argv[2] + '"\ndoes not exist');
	}

	var data = fs.readFileSync(process.argv[2]);
	app.set('configuration', JSON.parse(data.toString()));
};