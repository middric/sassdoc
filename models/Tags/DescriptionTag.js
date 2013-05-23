var util = require('util'),
	AbstractTag = require('./AbstractTag');

var DescriptionTag = function (k, v) {
	DescriptionTag.super_.call(this, k, v, 'description');
};
util.inherits(DescriptionTag, AbstractTag);
DescriptionTag.prototype.name = 'DescriptionTag';

module.exports = DescriptionTag;