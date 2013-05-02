var SassComponent = require('../../models/SassComponent.js'),
	e = require('../../config/exceptions.js');

describe('SassComponent', function () {
	it("should return an empty array if no components found", function () {
		var fixture = "$color: red;\n@mixin test {\nbody {\nbackground: $color;\n}\n}";
		expect(SassComponent.getComponents(fixture).length).toEqual(0);
	});

	it("should return a populated array if components exit", function () {
		var fixture = "$color: red;\n// @component\n@mixin test {\nbody {\nbackground: $color;\n}}",
			expected = [{name: '', sass: "@mixin test {\nbody {\nbackground: $color;\n}}"}],
			result = SassComponent.getComponents(fixture);

		expect(result.length).toEqual(1);
		expect(result).toEqual(expected);
	});

	it("should be able to return multiple components", function () {
		var fixture = "$color: red;\n/*\n * @component\n*/\n@mixin test {\nbody {\nbackground: $color;\n}\n}\n// @component\n@mixin test {\nbody {\nbackground: $color;\n}\n}",
			expected = [{name: '', sass: "@mixin test {\nbody {\nbackground: $color;\n}\n}"},{name: '', sass: "@mixin test {\nbody {\nbackground: $color;\n}\n}"}],
			result = SassComponent.getComponents(fixture);

		expect(result.length).toEqual(2);
		expect(result).toEqual(expected);
	});

	it("should be support named components", function () {
		var fixture = "$color: red;\n// @component My component\n@mixin test {\nbody {\nbackground: $color;\n}\n}",
			expected = [{name: 'My component', sass: "@mixin test {\nbody {\nbackground: $color;\n}\n}"}],
			result = SassComponent.getComponents(fixture);

		expect(result.length).toEqual(1);
		expect(result).toEqual(expected);
	});
});