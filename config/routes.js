module.exports = function (app) {
	var packageRoute = function (requestedPackage) {
		var sassDirectory = app.get('configuration'),
			SassFiles = require('../models/SassFiles.js'),
			SassDoc = require('../models/SassDoc.js'),
			SassParser = require('../models/SassParser.js');

		SassFiles.findFiles(sassDirectory);
		var files = SassFiles.readFiles(),
			blocks = [],
			toParse;
		for (var file in files) {
			blocks = blocks.concat(SassDoc.split(files[file], requestedPackage));
		}
		blocks = SassDoc.sort(blocks);
		for (var package in blocks) {
			for (var block in blocks[package]) {
				for (var j = 0; j < blocks[package][block].length; j++) {
					toParse = "@import \"" + blocks[package][block][j].filename + "\"; " + blocks[package][block][j].codeBlock;
					for (var include in blocks[package][block][j].docBlock['@import']) {
						toParse = "@import \"" + sassDirectory + '/' + blocks[package][block][j].docBlock['@import'][include] + "\";\n" + toParse;
					}
					toParse = "@import \"compass\";\n" + toParse;
					if (blocks[package][block][j].docBlock['@usage']) {
						toParse += blocks[package][block][j].docBlock['@usage'];
					}
					blocks[package][block][j].css = SassParser.parse(toParse);
				}
			}
		}

		var packages = SassDoc.getPackages();
		return {currentPackage: requestedPackage, packages: packages, blocks: blocks};
	};

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