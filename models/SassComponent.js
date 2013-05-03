var e = require('../config/exceptions.js'),
	fs = require('fs'),
	SassComponent = function () {
	var getName = function (line) {
			var matches;
			if (matches = line.match(/@name\s*(.+)$/)) {
				return matches[1];
			}
			return '';
		},
		getDescription = function (line) {
			var matches = line.match(/^\s\*\s@description\s+(.*)/);
			return (matches) ? matches[1] : null;
		},
		startRecording = function (line) {
			return line.match(/^(\/\/|\s*\*)\s*@component/);
		},
		braceCounters = function (line) {
			return [line.match(/\{/g), line.match(/\}/g)];
		},
		getMarkup = function (line) {
			var matches = line.match(/^\s\*\s([^@]*)/);
			return (matches) ? matches[1] : null;
		},
		getUsage = function (line) {
			var matches = line.match(/^\s\*\s@usage\s+(.*)/);
			return (matches) ? matches[1] : null;
		};

	return {
		getComponents: function(data) {
			var lines = data.split("\n"),
				components = [],
				openBraceCount = 0,
				closeBraceCount = 0,
				record = 0,
				markup;

			for (var i = 0; i < lines.length; i++) {
				if (startRecording(lines[i])) {
					components.push({name: '', description: '', sass: [], markup: [], usage: []});
					record = true;
					openBraceCount = 0;
					closeBraceCount = 0;
					continue;
				}
				if (record) {
					// Name detection
					if (name = getName(lines[i])) {
						components[components.length - 1].name = name;
					}

					// Description detection
					if (description = getDescription(lines[i])) {
						components[components.length - 1].description = description;
					}

					// Usage detection
					if (usage = getUsage(lines[i])) {
						components[components.length - 1].usage.push(usage);
						continue;
					}

					// Markup detection
					if (markup = getMarkup(lines[i])) {
						components[components.length - 1].markup.push(markup);
						continue;
					}

					// Brace counters
					var count = braceCounters(lines[i]);
					openBraceCount += (count[0]) ? count[0].length : 0;
					closeBraceCount += (count[1]) ? count[1].length : 0;

					// Only record lines if openbrace count is greater than 0
					if (openBraceCount > 0) {
						components[components.length - 1].sass.push(lines[i]);			

						if (closeBraceCount === openBraceCount) {
							components[components.length - 1].sass = components[components.length - 1].sass.join("\n");
							components[components.length - 1].markup = components[components.length - 1].markup.join("\n");
							components[components.length - 1].usage = components[components.length - 1].usage.join("\n");
							record = false;
						}
					}
				}
			}

			return components;
		}
	};
};

module.exports = new SassComponent();