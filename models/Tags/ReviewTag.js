var util = require('util'),
    AbstractTag = require('./AbstractTag');

var ReviewTag = function (k, v) {
    ReviewTag.super_.call(this, k, v, 'review');
};
util.inherits(ReviewTag, AbstractTag);
ReviewTag.prototype.name = 'ReviewTag';

module.exports = ReviewTag;