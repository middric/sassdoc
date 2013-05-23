var util = require('util'),
	AbstractTag = require('./AbstractTag');

var ArgumentTag = function (k, v) {
	ArgumentTag.super_.call(this, k, v, 'argument');
	this.getValue = function () {
		return this.value;
	};
	this.getArguments = function () {
		var args = [], matches;

		for (var i = this.value.length - 1; i >= 0; i--) {
			matches = this.value[i].match(/(\$[^\s]+)(.*)/);
			args.unshift({
				variable: matches[1].trim(),
				description: matches[2].trim()
			});
		}

		return args;
	};
};
util.inherits(ArgumentTag, AbstractTag);
ArgumentTag.prototype.name = 'ArgumentTag';

module.exports = ArgumentTag;