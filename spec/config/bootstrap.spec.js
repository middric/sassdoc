var Bootstrap = require('../../config/bootstrap.js'),
	e = require('../../config/exceptions.js');

describe('Bootstrap', function () {
	it("should throw an error with too few arguments", function () {
		expect(function () {
			Bootstrap([]);
		}).toThrow(new e.NotEnoughArgs);
	});

	it("should throw an error with a missing config file", function () {
		var filename = 'missingconfig.json';
		expect(function () {
			Bootstrap([1, 2, filename]);
		}).toThrow(new e.FileDoesNotExist(filename));
	});

	it("should throw an error with an invalid config file", function () {
		var filename = 'spec/fixtures/invalidconfig.json';
		expect(function () {
			Bootstrap([1, 2, filename]);
		}).toThrow(new e.InvalidJSONFile(filename));
	});

	it("should set an app variable containing the config json", function () {
		var filename = 'spec/fixtures/validconfig.json',
			app = require('express')(),
			json = require('../fixtures/validconfig.json');
		
		expect(Bootstrap([1, 2, filename], app)).toEqual(json);
	})
});