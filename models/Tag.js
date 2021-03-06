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

Tag.getTag = function (key, value) {
	var tagModel;
	try {
		tagModel = require('./Tags/' + key.charAt(0).toUpperCase() + key.slice(1) + 'Tag');
		return new tagModel(key, value);
	} catch (e) {
		if (!!process.env.debug) {
			throw e;
		}
	}

	throw new e.InvalidTag();
};

module.exports = Tag;