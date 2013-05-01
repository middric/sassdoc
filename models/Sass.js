var execSync = require('execSync'),
	Sass = function () {
	var sassCommand = 'sass',
		sassStyle = 'scss',
		useCompass = true;

	return {
		parse: function (sass) {
			var cmd = sassCommand + ' -s -t compressed --' + sassStyle,
				output;

			if (useCompass) {
				cmd += ' --compass';
			}
			output = execSync.stdout("echo '" + sass + "' | " + cmd);
			return output;
		},

		// Getters and setters
		setSassCommand: function (cmd) {
			sassCommand = cmd;
		},
		setSassStyle: function (style) {
			if (style === 'sass' || style === 'scss') {
				sassStyle = style;
			}
		},
		setCompass: function (bool) {
			useCompass = !!bool;
		},
		getSassCommand: function () {
			return sassCommand;
		},
		getSassStyle: function () {
			return sassStyle;
		},
		getCompass: function () {
			return useCompass;
		}
	};
};

module.exports = new Sass();