var execSync = require('execSync'),
	e = require('../config/exceptions.js'),
	sassCommand = 'sass',
	sassSyntax = 'scss',
	sassStyle = 'expanded',
	wrench = require('wrench'),
	Sass = function () {};

Sass.parse = function (input, app) {
	var cmd = sassCommand,
		config = app.get('configuration'),
		output;

	if (config.useCompass) {
		cmd += ' --compass';
	}
	cmd += ' -s -t ' + sassStyle + ' --' + sassSyntax;
	if (config.root) {
		output = execSync.exec("cd " + config.root + ";echo '" + input + "' | " + cmd );
	} else {
		output = execSync.exec("echo '" + input + "' | " + cmd );
	}
	if (output.code) {
		throw new e.UnableToParseSass(output.stdout);
	}
	if (matches = output.stdout.match(/(WARNING(.|[\r\n])*\n\n)/m)) {
		output.warnings = matches;
	}
	if (config.spriteDir) {
		wrench.mkdirSyncRecursive('public/temp/', 0777);
		wrench.copyDirSyncRecursive(
			config.root + '/' + config.spriteDir,
			'public/temp/sprites',
			{ forceDelete: true }
		);
		output.stdout = output.stdout.replace(/url\('/g, "url('/temp/sprites/");
	}

	return output;
};
Sass.isValid = function (input) {
	return !input.match(/(^\/\/|^\/\*|\*\/|^\s\*\s*$)/);
};

module.exports = Sass;