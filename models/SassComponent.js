var e = require('../config/exceptions.js'),
	fs = require('fs'),
	SassComponent = function () {

	return {
		getTemplates: function(data) {
			var lines = data.split("\n"),
				components = [],
				record = 0;

			for (var i = 0; i < lines.length; i++) {
				if (lines[i].match(/^\/\/ @component/)) {
					components.push([]);
					record = true;
					continue;
				}

				if (lines[i].match(/^\/\/ @end/)) {
					components[components.length - 1] = components[components.length - 1].join("\n");
					record = false;
					continue;
				}

				if (record) {
					components[components.length - 1].push(lines[i]);
				}
			}

			return components;
		}
	};
};

module.exports = new SassComponent();