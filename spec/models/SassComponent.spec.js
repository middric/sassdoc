var SassComponent = require('../../models/SassComponent.js'),
	e = require('../../config/exceptions.js');

describe('SassComponent', function () {
	it("should return an empty array if no components found", function () {
		var fixture = "$color: red;\n@mixin test {\nbody {\nbackground: $color;\n}\n}";
		expect(SassComponent.getTemplates(fixture).length).toEqual(0);
	});

	it("should return a populated array if components exit", function () {
		var fixture = "$color: red;\n// @component\n@mixin test {\nbody {\nbackground: $color;\n}\n}",
			expected = "@mixin test {\nbody {\nbackground: $color;\n}\n}",
			result = SassComponent.getTemplates(fixture);

		expect(result.length).toEqual(1);
		expect(result[0]).toBe(expected);
	});

	it("should be able to return multiple components", function () {
		var fixture = "$color: red;\n// @component\n@mixin test {\nbody {\nbackground: $color;\n}\n}\n// @component\n@mixin test {\nbody {\nbackground: $color;\n}\n}",
			expected = ["@mixin test {\nbody {\nbackground: $color;\n}\n}","@mixin test {\nbody {\nbackground: $color;\n}\n}"],
			result = SassComponent.getTemplates(fixture);

		expect(result.length).toEqual(2);
		expect(result).toEqual(expected);
	});
});