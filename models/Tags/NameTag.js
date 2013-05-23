var util = require('util'),
	AbstractTag = require('./AbstractTag');

var NameTag = function (k, v) {
	NameTag.super_.call(this, k, v, 'name');

	this.getID = function () {
		return this.getValue().replace(/[^\w]/g, '_').toLowerCase();
	};
};
util.inherits(NameTag, AbstractTag);
NameTag.prototype.name = 'NameTag';

module.exports = NameTag;