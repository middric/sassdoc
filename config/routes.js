module.exports = function (app) {
	var packageRoute = function (requestedPackage) {
		var sassDirectory = app.get('configuration'),
			SassFiles = require('../models/SassFiles.js'),
			SassDoc = require('../models/SassDoc.js'),
			SassParser = require('../models/SassParser.js');

		SassFiles.findFiles(sassDirectory);
		var files = SassFiles.readFiles(),
			components = [],
			toParse;
		for (var file in files) {
			components = components.concat(SassDoc.split(files[file], requestedPackage));
		}
		components = SassDoc.sort(components);

		for (var package in components) {
			for (var j = 0; j < components[package].length; j++) {
				toParse = "@import \"" + components[package][j].filename + "\"; " + components[package][j].codeBlock;
				if (components[package][j].docBlock['@import']) {
					toParse = "@import \"" + __dirname + '/../' + components[package][j].docBlock['@import'] + "\";\n" + toParse;
				}
				if (components[package][j].docBlock['@usage']) {
					toParse += components[package][j].docBlock['@usage'];
				}
				components[package][j].css = SassParser.parse(toParse);
			}
		}

		var packages = SassDoc.getPackages();
		return {currentPackage: requestedPackage, packages: packages, components: components};
	};

	/*app.get('/', function (req, res) {
		res.render('index', { title: 'Express' });
	});*/
	app.get('/', function (req, res) {
		res.render('components', packageRoute('Global'));
	});

	app.get('/packages/:package', function (req, res) {
		res.render('components', packageRoute(req.params.package));
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