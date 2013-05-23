var util = require('util'),
	AbstractTag = require('./AbstractTag');

var VariableTag = function (k, v) {
	VariableTag.super_.call(this, k, v, 'variable');
};
util.inherits(VariableTag, AbstractTag);
VariableTag.prototype.name = 'VariableTag';

module.exports = VariableTag;