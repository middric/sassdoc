var execSync = require('execSync'),
	e = require('../config/exceptions.js'),
	sassCommand = 'sass',
	sassSyntax = 'scss',
	sassStyle = 'expanded',
	useCompass = true,
	Sass = function () {};

Sass.parse = function (input) {
	var cmd = sassCommand + ' -s -t ' + sassStyle + ' --' + sassSyntax,
		output;

	if (useCompass) {
		cmd += ' --compass';
	}
	output = execSync.exec("echo '" + input + "' | " + cmd);
	if (output.code) {
		throw new e.UnableToParseSass(output.stdout);
	}
	return output.stdout;
};
Sass.isValid = function (input) {
	return !input.match(/(^\/\/|^\/\*|\*\/|^\s\*\s*$)/);
};

module.exports = Sass;