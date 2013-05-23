var util = require('util'),
	exceptions = {},
	AbstractException = function (message, constructor) {
		var red = '\033[31m',
			reset = '\033[0m';
		Error.captureStackTrace(this, constructor || this);
		this.message = red + (message || 'Exception') + reset;
		this.friendly = message || 'Exception';
	},
	ExceptionFactory = function (name, defaultMessage) {
		var exception = function (message) {
			exception.super_.call(this, message || defaultMessage, this.constructor);
		};
		util.inherits(exception, AbstractException);
		exception.prototype.name = name + 'Exception';
		exceptions[name] = exception;
	};

util.inherits(AbstractException, Error);
AbstractException.prototype.name = 'Abstract Exception';

ExceptionFactory('NotEnoughArgs', 'Not enough arguments');
ExceptionFactory('FileDoesNotExist', 'File does not exist');
ExceptionFactory('DirectoryDoesNotExist', 'Directory does not exist');
ExceptionFactory('UnableToReadFile', 'File cannot be read');
ExceptionFactory('InvalidJSONFile', 'File is not valid JSON');
ExceptionFactory('UnableToParseSass', 'Unable to parse Sass file');

module.exports = exceptions;