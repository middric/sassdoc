var Bootstrap = require('../config/bootstrap.js'),
	e = require('../config/exceptions.js');

describe('Bootstrap', function () {
	it("should throw an error with too few arguments", function () {
		expect(function () {
			Bootstrap([]);
		}).toThrow(new e.NotEnoughArgs);
	});

	it("should throw an error with a missing config file", function () {
		var filename = 'missingfile';
		expect(function () {
			Bootstrap([1, 2, filename]);
		}).toThrow(new e.FileDoesNotExist(filename));
	});

	it("should throw an error with an invalid config file", function () {
		var filename = 'spec/fixtures/invalidfile.json';
		expect(function () {
			Bootstrap([1, 2, filename]);
		}).toThrow(new e.InvalidJSONFile(filename));
	});
});