var Sass = require('../../models/Sass.js'),
	fixture = require('../fixtures/sass.json'),
	e = require('../../config/exceptions.js');

describe('Sass', function () {
	it("should set the Sass command", function () {
		var sassCommand = 'mySassCommand';
		Sass.setSassCommand(sassCommand);

		expect(Sass.getSassCommand()).toEqual(sassCommand);
	});
	it("should set the Sass style", function () {
		var sassStyle = 'scss',
			invalidStyle = 'invalid';

		Sass.setSassStyle(sassStyle);
		expect(Sass.getSassStyle()).toEqual(sassStyle);

		Sass.setSassStyle(invalidStyle);
		expect(Sass.getSassStyle()).toEqual(sassStyle);
	});
	it("should set the Compass option", function () {
		var compass = false;

		Sass.setCompass(compass);
		expect(Sass.getCompass()).toEqual(compass);

		compass = true;
		Sass.setCompass(compass);
		expect(Sass.getCompass()).toEqual(compass);
	});

	it("should parse sass", function () {
		Sass.setSassCommand('sass');
		expect(Sass.parse(fixture.in)).toBe(fixture.out);
	});

	it("should throw an exception with invalid sass", function () {
		expect(function () {
			Sass.parse(fixture.invalid);
		}).toThrow(new e.UnableToParseSass);
	})
});