var cache = require('memory-cache');

module.exports = function (app) {
	var packageRoute = function (requestedPackage, requestedBlock) {
		var sassDirectory = app.get('configuration'),
			Files = require('../models/Files.js'),
			Block = require('../models/Block.js'),
			config = app.get('configuration'),
			blocks = [],
			files, file, i, packages;

		Files.findFiles(config.root + '/' + config.sassDirectory);
		files = Files.readFiles();

		for (file in files) {
			blocks = blocks.concat(Block.getBlocks(files[file], app));
		}
		for (i = blocks.length - 1; i >= 0; i--) {
			blocks[i].parse();
		}
		blocks = Block.sort(blocks);
		packages = Block.getPackages(blocks);
		blocks = packages[requestedPackage].blocks;

		if (requestedBlock) {
			for (var i = blocks.length - 1; i >= 0; i--) {
				if (blocks[i].getID() == requestedBlock) {
					blocks = [blocks[i]];
					break;
				}
			}
		}

		return {
			currentPackage: packages[requestedPackage],
			packages: packages,
			blocks: blocks,
			only: requestedBlock
		};
	};

	app.get('/', function (req, res) {
		var html;
		if (html = cache.get('global')) {
			res.send(html);
		} else {
			res.setHeader('Cache-Control', 'public, max-age=3000');
			res.render('view', packageRoute('global'), function(err, html) {
				cache.put('global', html, 300000);
				res.send(html);
			});
		}
	});

	app.get('/packages/:package', function (req, res) {
		var html;
		if (html = cache.get(req.params.package)) {
			res.send(html);
		} else {
			res.setHeader('Cache-Control', 'public, max-age=3000');
			res.render('view', packageRoute(req.params.package), function(err, html) {
				cache.put(req.params.package, html, 300000);
				res.send(html);
			});
		}
	});

	app.get('/packages/:package/:block', function (req, res) {
		res.render('view', packageRoute(req.params.package, req.params.block));
	});
}