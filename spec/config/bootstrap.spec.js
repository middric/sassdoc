var Bootstrap = require('../../config/bootstrap.js'),
	e = require('../../config/exceptions.js');

describe('Bootstrap', function () {
	it("should throw an error with too few arguments", function () {
		expect(function () {
			Bootstrap([]);
		}).toThrow(new e.NotEnoughArgs);
	});

	it("should set an app variable containing the config json", function () {
		var sass_dir = 'spec/fixtures/sass',
			app = require('express')();
		
		expect(Bootstrap([1, 2, sass_dir], app)).toEqual(sass_dir);
	})
});