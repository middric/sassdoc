var util = require('util'),
    AbstractTag = require('./AbstractTag');

var TodoTag = function (k, v) {
    TodoTag.super_.call(this, k, v, 'todo');
};
util.inherits(TodoTag, AbstractTag);
TodoTag.prototype.name = 'TodoTag';

module.exports = TodoTag;