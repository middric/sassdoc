var util = require('util'),
	AbstractTag = require('./AbstractTag');

var NameTag = function (k, v) {
	NameTag.super_.call(this, k, v, 'name');

	this.getID = function () {
		return this.getValue()
			.trim()
			.toLowerCase()
		// These could be nicer
			.replace(/[^\w]/g, '_')
			.replace(/^_+|_+$/g, '')
			.replace(/_{2,}/, '_');
	};
};
util.inherits(NameTag, AbstractTag);
NameTag.prototype.name = 'NameTag';

module.exports = NameTag;