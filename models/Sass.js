var execSync = require('execSync'),
	e = require('../config/exceptions.js'),
	sassCommand = 'sass',
	sassSyntax = 'scss',
	sassStyle = 'expanded',
	useCompass = true,
	Sass = function () {
	return {
		parse: function (sass) {
			var cmd = sassCommand + ' -s -t ' + sassStyle + ' --' + sassSyntax,
				output;

			if (useCompass) {
				cmd += ' --compass';
			}
			output = execSync.exec("echo '" + sass + "' | " + cmd);
			if (output.code) {
				throw new e.UnableToParseSass(output.stdout);
			}
			return output.stdout;
		},

		// Getters and setters
		setSassStyle: function (style) {
			if (style === 'compressed' || style === 'nested' || style === 'compact' || style === 'expanded') {
				sassStyle = style;
			}
		},
		getSassStyle: function () {
			return sassStyle;
		},
		setSassCommand: function (cmd) {
			sassCommand = cmd;
		},
		setSassSyntax: function (style) {
			if (style === 'sass' || style === 'scss') {
				sassSyntax = style;
			}
		},
		setCompass: function (bool) {
			useCompass = !!bool;
		},
		getSassCommand: function () {
			return sassCommand;
		},
		getSassSyntax: function () {
			return sassSyntax;
		},
		getCompass: function () {
			return useCompass;
		}
	};
};

Sass.parse = function (input) {
	var cmd = sassCommand + ' -s -t ' + sassStyle + ' --' + sassSyntax,
		output;

	if (useCompass) {
		cmd += ' --compass';
	}
	output = execSync.exec("echo '" + input + "' | " + cmd);
	if (output.code) {
		console.log(input);
		throw new e.UnableToParseSass(output.stdout);
	}
	return output.stdout;
}
Sass.isValid = function (input) {
	return !input.match(/(^\/\/|^\/\*|\*\/|^\s\*\s*$)/);
}

module.exports = Sass;