var util = require('util'),
	AbstractTag = require('./AbstractTag');

var ImportTag = function (k, v) {
	ImportTag.super_.call(this, k, v, 'import');
	this.getValue = function () {
		return this.value;
	};
	this.getImportStatements = function (root) {
		var statements = [];

		for (var i = this.value.length - 1; i >= 0; i--) {
			statements.unshift("@import \"" + root + '/' + this.value[i] + "\";");
		}

		return statements;
	};
};

util.inherits(ImportTag, AbstractTag);
ImportTag.prototype.name = 'ImportTag';

module.exports = ImportTag;