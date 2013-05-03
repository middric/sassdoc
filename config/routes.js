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
			for (var j = 0; j < components.length; j++) {
				components[j].css = SassParser.parse(components[j].sass + components[j].usage);
			}
		}

		res.render('iframe', {components: components});
	});
}