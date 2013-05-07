module.exports = function (app) {
	app.get('/', function (req, res) {
		res.render('index', { title: 'Express' });
	});
	app.get('/component', function (req, res) {
		var config = app.get('configuration'),
			SassFiles = require('../models/SassFiles.js'),
			SassDoc = require('../models/SassDoc.js'),
			SassParser = require('../models/SassParser.js');

		SassFiles.findFiles(config.sassDirectory);
		var files = SassFiles.readFiles(),
			components = [],
			toParse;
		for (var i = 0; i < files.length; i++) {
			components = components.concat(SassDoc.split(files[i]));
		}
		components = SassDoc.sort(components);

		for (var package in components) {
			for (var j = 0; j < components[package].length; j++) {
				toParse = components[package][j].codeBlock;
				if (components[package][j].docBlock['@usage']) {
					toParse += components[package][j].docBlock['@usage'];
				}
				components[package][j].css = SassParser.parse(toParse);
			}
		}

		res.render('components', {packages: components});
	});
	app.get('/variables', function (req, res) {
		var config = app.get('configuration'),
			SassFiles = require('../models/SassFiles.js'),
			SassVariable = require('../models/SassVariable.js');

		SassFiles.findFiles(config.sassDirectory);
		var files = SassFiles.readFiles(),
			variables = [];
		for (var i = 0; i < files.length; i++) {
			variables = variables.concat(SassVariable.getVariables(files[i]));
		}

		res.render('variables', {variables: variables});
	});
}