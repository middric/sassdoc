var AbstractTag = require('./Tags/AbstractTag'),
	e = require('../config/exceptions'),
	Tag = function () {};

Tag.isValid = function (input) {
	var matches = input.match(/^\s+\*\s+@([a-z]+)(.*)$/i);

	if (!matches) {
		return false;
	}
 
	return [matches[1].trim(), matches[2].trim()];
};

Tag.isMarkup = function (input) {
	var matches = input.match(/^\s\*[^\*\/](.+)/);

	if (!matches) {
		return false;
	}

	return matches[1];
};

Tag.getTag = function (input) {
	var tagModel;
	try {
		if (parts = Tag.isValid(input)) {
			tagModel = require('./Tags/' + parts[0] + 'Tag');
			obj = new tagModel(parts[0], parts[1]);
			return new tagModel(parts[0], parts[1]);
		}
	} catch (e) {}

	throw new e.InvalidTag();
};

module.exports = Tag;