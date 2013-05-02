var e = require('../config/exceptions.js'),
	fs = require('fs'),
	SassComponent = function () {
	var getComponentName = function (line) {
		var matches;
		if (matches = line.match(/@component\s*(.+)$/)) {
			return matches[1];
		}
		return '';
	}

	return {
		getComponents: function(data) {
			var lines = data.split("\n"),
				components = [],
				openBraceCount = 0,
				closeBraceCount = 0,
				record = 0,
				matches;

			for (var i = 0; i < lines.length; i++) {
				if (lines[i].match(/^(\/\/|\s*\*)\s*@component/)) {
					components.push({name: getComponentName(lines[i]), sass: [], markup: []});
					record = true;
					continue;
				}
				if (!record) {
					continue;
				}

				// Brace counters
				if (matches = lines[i].match(/\{/g)) {
					openBraceCount += matches.length;
				}
				if (matches = lines[i].match(/\}/g)) {
					closeBraceCount += matches.length;
				}

				// Markup detection
				if (matches = lines[i].match(/^\s\*\s(.*)/)) {
					components[components.length - 1].markup.push(matches[1]);
					continue;
				}

				// Only record lines if openbrace count is greater than 0
				if (openBraceCount > 0) {
					components[components.length - 1].sass.push(lines[i]);			

					if (closeBraceCount === openBraceCount) {
						components[components.length - 1].sass = components[components.length - 1].sass.join("\n");
						components[components.length - 1].markup = components[components.length - 1].markup.join("\n");
						record = false;
					}
				}
			}

			return components;
		}
	};
};

module.exports = new SassComponent();