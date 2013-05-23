var util = require('util'),
	AbstractTag = require('./AbstractTag');

var ArgumentTag = function (k, v) {
	ArgumentTag.super_.call(this, k, v, 'argument');
	this.getValue = function () {
		return this.value;
	};
	this.getVariables = function () {
		var vars = [];

		for (var i = this.value.length - 1; i >= 0; i--) {
			vars.unshift(this.value[i].replace(/(\$[^\s]+).*/, '$1'));
		}

		return vars;
	};
	this.getDescriptions = function () {
		var descriptions = [];

		for (var i = this.value.length - 1; i >= 0; i--) {
			descriptions.unshift(this.value[i].replace(/\$[^\s]+(.*)/, '$1'));
		}

		return descriptions;
	};
};
util.inherits(ArgumentTag, AbstractTag);
ArgumentTag.prototype.name = 'ArgumentTag';

module.exports = ArgumentTag;