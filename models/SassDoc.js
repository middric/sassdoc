var SassDoc = function () {
	var tags = {
		"@variable": /@variable/,
		"@component": /@component/,
		"@package": function (str) {
			var matches = str.match(/@package\s+(.+)$/);
			return (matches) ? matches[1].trim() : false;
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
		"@markup": function (str) {
			var matches = str.match(/^\s\*\s([^@]*)/);
			return (matches) ? matches[1].trim() : false;
		}
	},
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
		// Splits Sass source code into documented parts
		split: function (input) {
			var lines = input.split("\n"),
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
					// Mid block
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

					codeBlock = codeBlock.join("\n");
					parts.push({"docBlock": docBlock, "codeBlock": codeBlock});
					recording = false;
				}
			}

			if (recording) {
				codeBlock = codeBlock.join("\n");
				parts.push({"docBlock": docBlock, "codeBlock": codeBlock});
			}

			return parts;
		},
		sort: function (parts) {
			var packages = {"Global": []};
			for( var i = 0; i < parts.length; i++) {
				if (parts[i].docBlock['@package']) {
					if (!packages[parts[i].docBlock['@package']]) {
						packages[parts[i].docBlock['@package']] = [];
					}
					packages[parts[i].docBlock['@package']].push(parts[i]);
				} else {
					packages.Global.push(parts[i]);
				}
			}

			return packages;
		}
	}
};

module.exports = new SassDoc();