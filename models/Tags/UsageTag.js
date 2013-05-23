var util = require('util'),
	AbstractTag = require('./AbstractTag');

var UsageTag = function (k, v) {
	UsageTag.super_.call(this, k, v, 'usage');
};
util.inherits(UsageTag, AbstractTag);
UsageTag.prototype.name = 'UsageTag';

module.exports = UsageTag;