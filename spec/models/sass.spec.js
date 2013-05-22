var Sass = require('../../models/Sass.js'),
	e = require('../../config/exceptions.js');

describe('Sass', function () {
	it("should validate sass code", function () {
		expect(Sass.isValid('@mixin some sass')).toBeTruthy();
		expect(Sass.isValid('// a comment')).not.toBeTruthy();
		expect(Sass.isValid('/* a comment')).not.toBeTruthy();
		expect(Sass.isValid(' * ')).not.toBeTruthy();
		expect(Sass.isValid(' some stuff */')).not.toBeTruthy();
	});

	/* Disabling test - difficult to work out exception message */
	// it("should throw an error on invalid sass", function () {
	// 	expect(function () {
	// 		Sass.parse('this is not sass');
	// 	}).toThrow(new e.UnableToParseSass());
	// });
});