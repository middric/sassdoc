var e = require('../../config/exceptions.js');

var AbstractTag = function (k, v, name) {
	if (k !== name) {
		throw new e.InvalidTag();
	}
	this.name = k;
	this.value = v;

	this.getName = function () {
		return this.name;
	};
	this.getValue = function () {
		return this.value;
	};
	this.isVariable = function () {
		return this.name === 'variable';
	};
};

module.exports = AbstractTag;