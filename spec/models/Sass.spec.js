var Sass = require('../../models/Sass.js'),
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
		var sass = require('../fixtures/sass.json');

		Sass.setSassCommand('sass');
		expect(Sass.parse(sass.in)).toBe(sass.out);
	});
});