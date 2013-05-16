var Tag = require('../models/Tag.js'),
	Sass = require('../models/Sass.js'),
	_ = require('underscore'),
	Block = function (line, app) {
	var lines = [],
		tags = {}, example = [], sass = [], css = '';

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
			return tags[name];
		},

		getImports: function () {
			var config = app.get('configuration'),
				tags = this.getTag('import'),
				imports = [];

			for (var include in config.imports) {
				imports.push("@import \"" + config.root + '/' + config.sassDirectory + '/' + config.imports[include] + "\";");
			}

			for (var tag in tags) {
				imports.push("@import \"" + config.root + '/' + config.sassDirectory + '/' + tags[tag].getValue() + "\";");
			}

			return imports;
		},

		getCSS: function () {
			return css;
		},

		parse: function () {
			var tag, markup, i = 0, tagName, toParse;
			for (; i < lines.length; i++) {
				if (tag = Tag.isValid(lines[i])) {
					tagName = tag.getName();
					if (!tags[tagName]) {
						tags[tagName] = [];
					}
					tags[tagName].push(tag);
					if (tag.isVariable()) {
						this.isVariable = true;
					}
					continue;
				}

				if (markup = Tag.isMarkup(lines[i])) {
					example.push(markup);
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
	var packages = [], i = blocks.length - 1, blockPackages, j;

	for (; i >= 0; i--) {
		blockPackages = blocks[i].getTag('package');
		for (j in blockPackages) {
			if (packages.indexOf(blockPackages[j].getValue()) == -1) {
				packages.push(blockPackages[j].getValue());
			}
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