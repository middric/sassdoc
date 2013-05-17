var Tag = require('../models/Tag.js'),
	Sass = require('../models/Sass.js'),
	_ = require('underscore'),
	Block = function (line, app) {
	var lines = [],
		tags = {}, markup = [], sass = [], css = '';

	if (line) {
		lines.push(line);
	}

	return {
		isVariable: false,

		addLines: function(input) {
			lines.push(input);
		},

		getLines: function () {
			return lines.join("\n");
		},

		getTag: function (name) {
			if (!tags[name]) {
				return;
			}

			return tags[name];
		},

		getTagValue: function (name) {
			var tag = this.getTag(name),
				value = '';

			if (tag) {
				for (var i = tag.length - 1; i >= 0; i--) {
					value = tag[i].getValue() + "\n" + value;
				}
			}

			return value;
		},

		getMarkup: function () {
			return markup.join("\n");
		},

		getSass: function () {
			return sass.join("\n");
		},

		getImports: function () {
			var config = app.get('configuration'),
				importStatements = this.getTag('import'),
				imports = [];

			for (var include in config.imports) {
				imports.push("@import \"" + config.root + '/' + config.sassDirectory + '/' + config.imports[include] + "\";");
			}

			for (var i in importStatements) {
				imports.push("@import \"" + config.root + '/' + config.sassDirectory + '/' + importStatements[i].getValue() + "\";");
			}

			return imports;
		},

		getCSS: function () {
			return css;
		},

		getExternal: function () {
			var config = app.get('configuration'),
				externals = this.getTag('external'),
				linkTag = '<link href="%s" rel="stylesheet" />',
				markup = [];

			if (externals) {
				for (var i = externals.length - 1; i >= 0; i--) {
					markup.unshift(linkTag.replace('%s', externals[i].getValue()));
				}
			}

			markup.unshift(linkTag.replace('%s', config.externalCSS));

			return markup.join('');
		},

		parse: function () {
			var line, i = 0, tagName, toParse;
			for (; i < lines.length; i++) {
				if (line = Tag.isValid(lines[i])) {
					tagName = line.getName();
					if (!tags[tagName]) {
						tags[tagName] = [];
					}
					tags[tagName].push(line);
					if (line.isVariable()) {
						this.isVariable = true;
					}
					continue;
				}

				if (line = Tag.isMarkup(lines[i])) {
					markup.push(line);
					continue;
				}

				if (_.size(tags) && Sass.isValid(lines[i])) {
					sass.push(lines[i]);
				}
			}

			if (_.size(tags)) {
				toParse = this.getImports();
				toParse = toParse.join("\n") + sass.join("\n");
				css = Sass.parse(toParse);
			}
		}
	};
};

Block.getPackages = function (blocks) {
	var packages = {}, i = blocks.length - 1, blockPackages, key, j;

	packages.global = {url: 'global', name: 'Global', blocks: []};

	for (; i >= 0; i--) {
		blockPackages = blocks[i].getTag('package');
		if (blockPackages) {
			for (j in blockPackages) {
				key = blockPackages[j].getValue().replace(/[^\w]/g, '_').toLowerCase();
				if (!packages[key]) {
					packages[key] = {
						url: key,
						name: blockPackages[j].getValue(),
						blocks: [blocks[i]]
					};
				} else {
					packages[key].blocks.unshift(blocks[i]);
				}
			}
		} else {
			packages.global.blocks.unshift(blocks[i]);
		}
	};

	return packages;
};

Block.getBlocks = function (input, app) {
	var lines = input.split("\n"), line = '',
		blocks = [],
		currentBlock = null,
		openCount = 0, closeCount = 0;

	while ((line = lines.shift()) !== undefined) {
		if (line.match(/^\/\*\*/)) {
			blocks.push(new Block(line, app));
			currentBlock = blocks.length - 1;
			openCount = 0, closeCount = 0;
			continue;
		}
		if (currentBlock !== null) {
			if (line.match(/\{/)) {
				openCount++;
			}
			if (line.match(/\}/)) {
				closeCount++;
			}
			if (openCount && closeCount && openCount === closeCount) {
				blocks[currentBlock].addLines(line);
				currentBlock = null;
				continue;
			}
			blocks[currentBlock].addLines(line);
		}
	}
	return blocks;
};

Block.sort = function (blocks) {
	blocks.sort(function (a, b) {
		if (a.isVariable && !b.isVariable) {
			return -1;
		} else if (!a.isVariable && b.isVariable) {
			return 1;
		}
		return 0;
	});

	return blocks;
};

// Export the Block class rather than a Block object
module.exports = Block;