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
			components = components.concat(SassComponent.getComponents(files[i]));
			for (var j = 0; j < components.length; j++) {
				components[j].css = SassParser.parse(components[j].sass + components[j].usage);
			}
		}

		res.render('components', {components: components});
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