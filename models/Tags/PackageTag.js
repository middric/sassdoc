var util = require('util'),
	AbstractTag = require('./AbstractTag');

var PackageTag = function (k, v) {
	PackageTag.super_.call(this, k, v, 'package');
};
util.inherits(PackageTag, AbstractTag);
PackageTag.prototype.name = 'PackageTag';

module.exports = PackageTag;