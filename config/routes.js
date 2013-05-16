module.exports = function (app) {
	var packageRoute = function (requestedPackage) {
		var sassDirectory = app.get('configuration'),
			Files = require('../models/Files.js'),
			SassDoc = require('../models/SassDoc.js'),
			Sass = new (require('../models/Sass.js')),
			Block = require('../models/Block.js'),
			config = app.get('configuration');

		Files.findFiles(config.root + '/' + config.sassDirectory);
		var files = Files.readFiles(),
			blocks = [],
			toParse;


		// New code
		for (var file in files) {
			blocks = Block.getBlocks(files[file].output, app);
			for (var i = blocks.length - 1; i >= 0; i--) {
				blocks[i].parse();
			}
			blocks = Block.sort(blocks);
		}
		var packages = Block.getPackages(blocks);

		// Old code below
		blocks = [];
		for (var file in files) {
			blocks = blocks.concat(SassDoc.split(files[file], requestedPackage, app));
		}
		blocks = SassDoc.sort(blocks);
		for (var package in blocks) {
			for (var block in blocks[package]) {
				for (var j = 0; j < blocks[package][block].length; j++) {
					toParse = blocks[package][block][j].codeBlock;// "@import \"" + blocks[package][block][j].filename + "\"; ";
					for (var include in config.imports) {
						toParse = "@import \"" + config.root + '/' + config.sassDirectory + '/' + config.imports[include] + "\";\n" + toParse;
					}
					for (var include in blocks[package][block][j].docBlock['@import']) {
						toParse = "@import \"" + config.root + '/' + config.sassDirectory + '/' + blocks[package][block][j].docBlock['@import'][include] + "\";\n" + toParse;
					}
					if (config.useCompass) {
						toParse = "@import \"compass\";\n" + toParse;
					}
					if (blocks[package][block][j].docBlock['@usage']) {
						toParse += blocks[package][block][j].docBlock['@usage'];
					}
					blocks[package][block][j].css = Sass.parse(toParse);

					blocks[package][block][j].external = [];
					for (var external in config.externalCSS) {
						blocks[package][block][j].external.push('<link rel="stylesheet" href="' + config.externalCSS[external] + '" />');
					}
				}
			}
		}

		return {currentPackage: requestedPackage, packages: packages, blocks: blocks};
	};

	app.get('/', function (req, res) {
		res.render('view', packageRoute('Global'));
	});

	app.get('/packages/:package', function (req, res) {
		res.render('view', packageRoute(req.params.package));
	});
}