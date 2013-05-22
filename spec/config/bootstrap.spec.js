var Bootstrap = require('../../config/bootstrap.js'),
	e = require('../../config/exceptions.js');

describe('Bootstrap', function () {
	it("should throw an error with too few arguments", function () {
		expect(function () {
			Bootstrap([]);
		}).toThrow(new e.NotEnoughArgs());
	});

	it("should throw an error if file does not exist", function () {
		expect(function () {
			Bootstrap([1, 2, 'doesNotExist']);
		}).toThrow(new e.FileDoesNotExist());
	});

	it("should throw an error if file contains invalid json", function () {
		var configFile = 'spec/fixtures/invalid.json';

		expect(function () {
			Bootstrap([1, 2, configFile]);
		}).toThrow(new e.InvalidJSONFile());
	});

	it("should set an app variable containing the config json", function () {
		var configFile = 'spec/fixtures/config.json',
			app = require('express')();

		expect(Bootstrap([1, 2, configFile], app).sassDirectory).toEqual('../../public/sass');
	});
});