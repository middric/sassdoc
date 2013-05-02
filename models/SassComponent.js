var e = require('../config/exceptions.js'),
	fs = require('fs'),
	SassComponent = function () {

	return {
		getTemplates: function(data) {
			var lines = data.split("\n"),
				components = [],
				openBraceCount = 0,
				closeBraceCount = 0,
				record = 0,
				matches;

			for (var i = 0; i < lines.length; i++) {
				if (lines[i].match(/^\/\/ @component/)) {
					components.push([]);
					record = true;
					continue;
				}

				if (record) {
					components[components.length - 1].push(lines[i]);

					if (matches = lines[i].match(/\{/g)) {
						openBraceCount += matches.length;
					}

					if (matches = lines[i].match(/\}/g)) {
						closeBraceCount += matches.length;
					}					

					if (closeBraceCount === openBraceCount) {
						components[components.length - 1] = components[components.length - 1].join("\n");
						record = false;
						continue;
					}
				}
			}

			return components;
		}
	};
};

module.exports = new SassComponent();