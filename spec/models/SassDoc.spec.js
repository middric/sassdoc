var SassDoc = require('../../models/SassDoc.js'),
	e = require('../../config/exceptions.js');

describe('SassDoc', function () {
	it("should return an empty array if no components found", function () {
		var fixture = {output: "@mixin test {\n	background: $colour1;\n	span {\n		display: block;\n		padding: 10px;\n	}\n}"};
		expect(SassDoc.split(fixture).length).toEqual(0);
	});

	it("should return a populated array if components are found", function () {
		var fixture = {filename: '', output: "/**\n * @component\n * @name Background mixin\n * @description A Mixin to change the background colour\n * @usage div { @include test }\n * <div><span>The body</span></div>\n */\n@mixin test { background: $colour1; span { display: block; padding: 10px; } }"},
			expected = [
				{
					docBlock: {
						"@component": true,
						"@name": 'Background mixin',
						"@description": 'A Mixin to change the background colour',
						"@usage": 'div { @include test }',
						"@markup": "<div><span>The body</span></div>\n"
					},
					codeBlock: '@mixin test { background: $colour1; span { display: block; padding: 10px; } }',
					filename: ''
				}
			];

		expect(SassDoc.split(fixture)).toEqual(expected);
	});
});