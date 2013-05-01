var util = require('util'),
	exceptions = {},
	AbstractException = function (message, constructor) {
		var red = '\033[31m',
			reset = '\033[0m';
		Error.captureStackTrace(this, constructor || this);
		this.message = red + (message || 'Exception') + reset;
	},
	ExceptionFactory = function (name, defaultMessage) {
		var exception = function (message) {
			exception.super_.call(this, defaultMessage || message, this.constructor);
		}
		util.inherits(exception, AbstractException);
		exception.prototype.name = name + 'Exception';
		exceptions[name] = exception;
	};

util.inherits(AbstractException, Error);
AbstractException.prototype.name = 'Abstract Exception';

ExceptionFactory('NotEnoughArgs', 'Not enough arguments');
ExceptionFactory('FileDoesNotExist', 'File does not exist');
ExceptionFactory('InvalidJSONFile', 'File is not valid JSON');
ExceptionFactory('UnableToParseSass', 'Unable to parse Sass file');

module.exports = exceptions;