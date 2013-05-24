var Tag = require('../models/Tag.js'),
	Sass = require('../models/Sass.js'),
	_ = require('underscore'),
	Block = function (line, app, file) {
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

		getID: function () {
			if (this.getTag('name')) {
				return this.getTag('name').getID();
			}

			return '';
		},

		getName: function () {
			if (this.getTag('name')) {
				return this.getTag('name').getValue();
			}

			if (this.isVariable) {
				return 'Variable';
			}

			return 'Component';
		},

		getTags: function () {
			return tags;
		},

		getTag: function (name) {
			if (!tags[name]) {
				return;
			}

			return tags[name];
		},

		getMarkup: function () {
			return markup.join("\n");
		},

		getSass: function () {
			return sass.join("\n");
		},

		getImports: function () {
			var config = app.get('configuration'),
				importTag = this.getTag('import'),
				imports = [];

			if (config.useCompass) {
				imports.push("@import \"compass\";");
			}

			for (var include in config.imports) {
				imports.push("@import \"" + config.root + '/' + config.sassDirectory + '/' + config.imports[include] + "\";");
			}

			if (importTag) {
				imports = imports.concat(importTag.getImportStatements(config.root + '/' + config.sassDirectory));
			}

			return imports.join("\n");
		},

		getCSS: function () {
			var toParse;
			if (!css && _.size(tags)) {
				try {
					toParse = this.getImports();
					toParse += sass.join("\n");
					toParse += (this.getTag('usage')) ? this.getTag('usage').getValue() : '';
					css = Sass.parse(toParse, app);
				} catch (e) {
					if (!!process.env.debug) {
						throw e;
					}
					return e;
				}
			}
			// Remove comments
			css.stdout = css.stdout.replace(/(?:\/\*(?:[\s\S]*?)\*\/)|(?:\/\/(?:.*)$)/gm, '');
			return css;
		},

		getExternal: function () {
			var config = app.get('configuration'),
				externalTag = (this.getTag('external')) ? this.getTag('external').getValue() : null,
				linkTag = '<link href="%s" rel="stylesheet" />',
				markup = [];

			if (externalTag) {
				for (var i = externalTag.length - 1; i >= 0; i--) {
					markup.unshift(linkTag.replace('%s', externalTag[i]));
				}
			}

			markup.unshift(linkTag.replace('%s', config.externalCSS));

			return markup.join('');
		},

		parse: function () {
			var parts, i = 0, tagName, toParse;
			for (; i < lines.length; i++) {
				try {
					if (parts = Tag.isValid(lines[i])) {
						tagName = parts[0];
						if (!tags[tagName]) {
							tags[tagName] = Tag.getTag(parts[0], parts[1]);
						} else {
							tags[tagName].addValue(parts[1]);
						}
						if (tags[tagName].isVariable()) {
							this.isVariable = true;
						}
						continue;
					}
				} catch (e) {
					if (!!process.env.debug) {
						throw e;
					}
				}

				if (parts = Tag.isMarkup(lines[i])) {
					markup.push(parts);
					continue;
				}
				if (_.size(tags) && Sass.isValid(lines[i])) {
					sass.push(lines[i]);
				}
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
			blockPackages = blockPackages.getValue();
			for (j in blockPackages) {
				key = blockPackages[j].replace(/[^\w]/g, '_').toLowerCase();
				if (!packages[key]) {
					packages[key] = {
						url: key,
						name: blockPackages[j],
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

Block.getBlocks = function (file, app) {
	var lines = file.output.split("\n"), line = '',
		blocks = [],
		currentBlock = null,
		openCount = 0, closeCount = 0;

	while ((line = lines.shift()) !== undefined) {
		if (line.match(/^\/\*\*/)) {
			blocks.push(new Block(line, app, file));
			currentBlock = blocks.length - 1;
			openCount = 0, closeCount = 0;
			continue;
		}
		if (currentBlock !== null) {
			if (!Tag.isValid(line) && line.match(/\{/)) {
				openCount++;
			}
			if (!Tag.isValid(line) && line.match(/\}/)) {
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