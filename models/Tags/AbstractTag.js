var e = require('../../config/exceptions.js');

var AbstractTag = function (k, v, name) {
	if (k !== name) {
		throw new e.InvalidTag();
	}
	this.name = k;
	this.value = [v];

	this.getName = function () {
		return this.name;
	};
	this.getValue = function () {
		return this.value.join("\n");
	};
	this.isVariable = function () {
		return this.name === 'variable';
	};
	this.addValue = function (v) {
		this.value.push(v);
	}
};

module.exports = AbstractTag;