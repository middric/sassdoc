var Tag = function (k, v) {
	var key = k.trim(),
		value = v.trim(),
		obj = {
			getName: function () {
				return key;
			},

			getValue: function () {
				return value;
			},

			isVariable: function () {
				return key === 'variable';
			}
		};

	obj.toString = function () {
		return key + ': ' + value;
	};

	return obj;
};

Tag.tags = [
	'variable',
	'component',
	'package',
	'name',
	'description',
	'usage',
	'import',
	'extends',
	'markup',
	'external'
];

Tag.isValid = function (input) {
	var matches = input.match(/^\s+\*\s+@([a-z]+)(.*)$/i);

	if (!matches) {
		return false;
	}

	if (Tag.tags.indexOf(matches[1]) < 0) {
		return false;
	}
	return new Tag(matches[1], matches[2]);
};

Tag.isMarkup = function (input) {
	var matches = input.match(/^\s\*[^\*\/](.+)/);

	if (!matches) {
		return false;
	}

	return matches[1];
}

module.exports = Tag;