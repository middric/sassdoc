var util = require('util'),
	AbstractTag = require('./AbstractTag');

var ImportTag = function (k, v) {
	ImportTag.super_.call(this, k, v, 'import');
	this.getValue = function () {
		return this.value;
	};
};
util.inherits(ImportTag, AbstractTag);
ImportTag.prototype.name = 'ImportTag';

module.exports = ImportTag;