var util = require('util'),
	AbstractTag = require('./AbstractTag');

var ExtendsTag = function (k, v) {
	ExtendsTag.super_.call(this, k, v, 'extends');
};
util.inherits(ExtendsTag, AbstractTag);
ExtendsTag.prototype.name = 'ExtendsTag';

module.exports = ExtendsTag;