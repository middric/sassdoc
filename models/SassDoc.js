var SassDoc = function () {
	var tags = {
		"@variable": /@variable/,
		"@component": /@component/,
		"@package": function (str) {
			var matches = str.match(/@package\s+(.+)$/),
				package = (matches) ? matches[1].trim() : null;
			packages.push(package);
			return package;
		},
		"@name": function(str) {
			var matches = str.match(/@name\s+(.+)$/);
			return (matches) ? matches[1].trim() : false;
		},
		"@description": function(str) {
			var matches = str.match(/@description\s+(.+)$/);
			return (matches) ? matches[1].trim() : false;
		},
		"@usage": function(str) {
			var matches = str.match(/@usage\s+(.+)$/);
			return (matches) ? matches[1].trim() : false;
		},
		"@import": function (str) {
			var matches = str.match(/@import\s+(.+)$/);
			return (matches) ? matches[1].trim() : false;
		},
		"@extends": function (str) {
			var matches = str.match(/@extends\s+(.+)$/);
			return (matches) ? matches[1].trim() : false;
		},
		"@markup": function (str) {
			var matches = str.match(/^\s\*\s([^@]*)/);
			return (matches) ? matches[1].replace(/(^\s|\s+$)/, '') + "\n" : false;
		}
	},
	packages = ['Global'],
	matchesTag = function (input) {
		var result;
		for (var tag in tags) {
			if (typeof tags[tag] === 'function') {
				if (result = tags[tag](input)) {
					return [tag, result];
				}
				continue;
			}

			if (input.match(tags[tag])) {
				return [tag];
			}
		}

		return false;
	};

	return {
		getPackages: function () {
			var a = [];
			for (var i = 0; i < packages.length; i++) {
				if (a.indexOf(packages[i]) == -1 && packages[i] !== null && packages[i] !== 'Global') {
					a.push(packages[i]);
				}
			}
			a = a.sort();
			a.unshift('Global');
			return a;
		},

		// Splits Sass source code into documented parts
		split: function (file, package) {
			var lines = file.output.split("\n"),
				parts = [],
				recording = false,
				docBlock, codeBlock, tag;

			for(var i = 0; i < lines.length; i++) {

				// Start of docBlock
				if (lines[i].match(/^\/\*\*/)) {
					docBlock = {};
					codeBlock = [];
					recording = true;
					continue;
				}

				if (recording) {
					if (lines[i].match(/^\s?\*/)) {
						if (tag = matchesTag(lines[i])) {
							if (!docBlock[tag[0]]) {
								docBlock[tag[0]] = '';
							}
							if (!tag[1]) {
								docBlock[tag[0]] = true;
							} else {
								docBlock[tag[0]] += tag[1];
							}
						}
						continue;
					}

					if (lines[i].match(/[^\s\n\r]+/)) {
						codeBlock.push(lines[i]);
						continue;
					}

					if (!docBlock['@package']) {
						docBlock['@package'] = packages[0];
					}
					codeBlock = codeBlock.join("\n");
					if ((codeBlock && !package) || (codeBlock && docBlock['@package'] == package)) {
						parts.push({"docBlock": docBlock, "codeBlock": codeBlock, "filename": file.filename});
					}
					recording = false;
				}
			}

			if (recording) {
				if (codeBlock) {
					codeBlock = codeBlock.join("\n");
				}
				if ((codeBlock && !package) || (codeBlock && docBlock['@package'] == package)) {
					parts.push({"docBlock": docBlock, "codeBlock": codeBlock, "filename": file.filename});
				}
			}

			return parts;
		},
		sort: function (parts) {
			var packages = {};
			for( var i = 0; i < parts.length; i++) {
				if (parts[i].docBlock['@package']) {
					if (!packages[parts[i].docBlock['@package']]) {
						packages[parts[i].docBlock['@package']] = {'Components': [], 'Variables': []};
					}
					if (parts[i].docBlock['@variable']) {
						packages[parts[i].docBlock['@package']].Variables.push(parts[i]);
					} else {
						packages[parts[i].docBlock['@package']].Components.push(parts[i]);
					}
				} else {
					if (!packages.Global) {
						packages.Global = {'Components': [], 'Variables': []};
					}
					packages.Global.Components.push(parts[i]);
				}
			}

			return packages;
		}
	}
};

module.exports = new SassDoc();