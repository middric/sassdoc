var util = require('util'),
	AbstractTag = require('./AbstractTag');

var ReturnTag = function (k, v) {
	ReturnTag.super_.call(this, k, v, 'return');
};
util.inherits(ReturnTag, AbstractTag);
ReturnTag.prototype.name = 'ReturnTag';

module.exports = ReturnTag;