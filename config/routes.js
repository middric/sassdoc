module.exports = function (app) {	
	app.get('/', function (req, res) {
		res.render('index', { title: 'Express' });
	});
	app.get('/component', function (req, res) {
		var config = app.get('configuration'),
			SassFiles = require('../models/SassFiles.js'),
			SassComponent = require('../models/SassComponent.js'),
			SassParser = require('../models/SassParser.js');

		SassFiles.findFiles(config.sassDirectory);
		var files = SassFiles.readFiles(),
			components = [];
		for (var i = 0; i < files.length; i++) {
			components = SassComponent.getComponents(files[i]);
			components[0].css = SassParser.parse(components[0].sass + components[0].usage);
		}

		res.render('iframe', {name: components[0].name, sass: components[0].sass, markup: components[0].markup, css: components[0].css});
	});
}