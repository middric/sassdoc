var util = require('util'),
	AbstractTag = require('./AbstractTag');

var ArgumentTag = function (k, v) {
	ArgumentTag.super_.call(this, k, v, 'argument');
};
util.inherits(ArgumentTag, AbstractTag);
ArgumentTag.prototype.name = 'ArgumentTag';

module.exports = ArgumentTag;