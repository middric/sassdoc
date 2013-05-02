var SassParser = require('../../models/SassParser.js'),
	fixture = require('../fixtures/sass.json'),
	e = require('../../config/exceptions.js');

describe('SassParser', function () {
	it("should set the Sass command", function () {
		var sassCommand = 'mySassCommand';
		SassParser.setSassCommand(sassCommand);

		expect(SassParser.getSassCommand()).toEqual(sassCommand);
	});
	it("should set the Sass syntax", function () {
		var sassSyntax = 'scss',
			invalidSyntax = 'invalid';

		SassParser.setSassSyntax(sassSyntax);
		expect(SassParser.getSassSyntax()).toEqual(sassSyntax);

		SassParser.setSassStyle(invalidSyntax);
		expect(SassParser.getSassSyntax()).toEqual(sassSyntax);
	});
	it("should set the Sass style", function () {
		var sassStyle = 'compressed';

		SassParser.setSassStyle(sassStyle);
		expect(SassParser.getSassStyle()).toEqual(sassStyle);
	});
	it("should set the Compass option", function () {
		var compass = false;

		SassParser.setCompass(compass);
		expect(SassParser.getCompass()).toEqual(compass);

		compass = true;
		SassParser.setCompass(compass);
		expect(SassParser.getCompass()).toEqual(compass);
	});

	it("should parse sass", function () {
		SassParser.setSassCommand('sass');
		expect(SassParser.parse(fixture.in)).toBe(fixture.out);
	});

	it("should throw an exception with invalid sass", function () {
		expect(function () {
			SassParser.parse(fixture.invalid);
		}).toThrow(new e.UnableToParseSass);
	})
});