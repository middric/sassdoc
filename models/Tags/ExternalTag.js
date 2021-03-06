var util = require('util'),
	AbstractTag = require('./AbstractTag');

var ExternalTag = function (k, v) {
	ExternalTag.super_.call(this, k, v, 'external');
	this.getValue = function () {
		return this.value;
	};
};
util.inherits(ExternalTag, AbstractTag);
ExternalTag.prototype.name = 'ExternalTag';

module.exports = ExternalTag;