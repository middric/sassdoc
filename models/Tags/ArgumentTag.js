var util = require('util'),
	AbstractTag = require('./AbstractTag');

var ArgumentTag = function (k, v) {
	ArgumentTag.super_.call(this, k, v, 'argument');
	this.getValue = function () {
		return this.value;
	};
	this.getArguments = function () {
		var args = [];

		for (var i = this.value.length - 1; i >= 0; i--) {
			args.unshift({
				variable: this.value[i].replace(/(\$[^\s]+).*/, '$1'),
				description: this.value[i].replace(/\$[^\s]+(.*)/, '$1')
			});
		}

		return args;
	};
};
util.inherits(ArgumentTag, AbstractTag);
ArgumentTag.prototype.name = 'ArgumentTag';

module.exports = ArgumentTag;