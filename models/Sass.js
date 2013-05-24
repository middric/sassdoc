var execSync = require('execSync'),
	e = require('../config/exceptions.js'),
	sassCommand = 'sass',
	sassSyntax = 'scss',
	sassStyle = 'expanded',
	Sass = function () {};

Sass.parse = function (input, app) {
	var cmd = sassCommand + ' -s -t ' + sassStyle + ' --' + sassSyntax,
		config = app.get('configuration'),
		output;

	if (config.useCompass) {
		cmd += ' --compass';
	}
	output = execSync.exec("echo '" + input + "' | " + cmd);
	if (output.code) {
		throw new e.UnableToParseSass(output.stdout);
	}
	if (matches = output.stdout.match(/(WARNING(.|[\r\n])*\n\n)/m)) {
		output.warnings = matches;
	}
	return output;
};
Sass.isValid = function (input) {
	return !input.match(/(^\/\/|^\/\*|\*\/|^\s\*\s*$)/);
};

module.exports = Sass;