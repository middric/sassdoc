var SassDoc = require('../../models/SassDoc.js'),
	e = require('../../config/exceptions.js');

describe('SassDoc', function () {
	it("should return an empty array if no components found", function () {
		var fixture = "@mixin test {\n	background: $colour1;\n	span {\n		display: block;\n		padding: 10px;\n	}\n}";
		expect(SassDoc.split(fixture).length).toEqual(0);
	});

	it("should return a populated array if components are found", function () {
		var fixture = "/**\n * @component\n * @name 		Background mixin\n * @description A Mixin to change the background colour\n * @usage 		div { @include test }\n * <div>\n *     <span>The body</span>\n * </div>\n */\n@mixin test {\n	background: $colour1;\n	span {\n		display: block;\n		padding: 10px;\n	}\n}",
			expected = [
				{
					docBlock: {
						"@component": true,
						"@name": 'Background mixin',
						"@description": 'A Mixin to change the background colour',
						"@usage": 'div { @include test }',
						"@markup": '<div><span>The body</span></div>'
					},
					codeBlock: "@mixin test {\n	background: $colour1;\n	span {\n		display: block;\n		padding: 10px;\n	}\n}"
				}
			];

		expect(SassDoc.split(fixture)).toEqual(expected);
	});
});