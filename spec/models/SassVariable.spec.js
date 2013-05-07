var SassVariable = require('../../models/SassVariable.js'),
	e = require('../../config/exceptions.js');

describe('SassVariable', function () {
	it("should return an empty array if no variables found", function () {
		var fixture = "$color: red;";
		expect(SassVariable.getVariables(fixture).length).toEqual(0);
	});

	it("should return a populated array if variables exist", function () {
		var fixture = "/**\n * @variable\n **/\n$color: red;",
			expected = [{name: '$color', value: 'red', sass: '$color: red;'}],
			result = SassVariable.getVariables(fixture);

		expect(result).toEqual(expected);
	});

	it("should be able to return multiple variables", function () {
		var fixture = "/**\n * @variable\n **/\n$color1: red;\n/**\n * @variable\n **/\n$color2: blue;",
			expected = [
				{name: '$color1', value: 'red', sass: '$color1: red;'},
				{name: '$color2', value: 'blue', sass: '$color2: blue;'}
			],
			result = SassVariable.getVariables(fixture);

		expect(result).toEqual(expected);
	});
});