var Tag = require('../models/Tag.js'),
	Sass = require('../models/Sass.js'),
	Block = function (line) {
	var lines = [],
		tags = [], example = [], sass = [];

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

		parse: function () {
			var tag, markup, i = lines.length - 1;
			for (; i >= 0; i--) {
				if (tag = Tag.isValid(lines[i])) {
					tags.unshift(tag);
					if (tag.isVariable()) {
						this.isVariable = true;
					}
					continue;
				}

				if (markup = Tag.isMarkup(lines[i])) {
					example.unshift(markup);
					continue;
				}

				if (Sass.isValid(lines[i])) {
					sass.unshift(lines[i]);
				}
			}
		}
	};
};

Block.getBlocks = function (input) {
	var lines = input.split("\n"), line = '',
		blocks = [],
		currentBlock = null,
		openCount = 0, closeCount = 0;

	while ((line = lines.shift()) !== undefined) {
		if (line.match(/^\/\*\*/)) {
			blocks.push(new Block(line));
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
}

// Export the Block class rather than a Block object
module.exports = Block;