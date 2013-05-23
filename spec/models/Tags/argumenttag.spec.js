var ArgumentTag = require('../../../models/Tags/ArgumentTag'),
	e = require('../../../config/exceptions.js');

describe('Argument tag model', function () {
	it("should return the arguments for the block", function () {
		var tag = new ArgumentTag('argument', '$myVar my var description'),
			expected = [{variable: '$myVar', description: 'my var description'}],
			output = tag.getArguments();

		for (var i = output.length - 1; i >= 0; i--) {
			expect(output[i].variable).toBe(expected[i].variable);
			expect(output[i].description).toBe(expected[i].description);
		}
	});

	it("should return multiple arguments for the block", function () {
		var tag = new ArgumentTag('argument', '$myVar my var description'),
			expected = [
				{variable: '$myVar', description: 'my var description'},
				{variable: '$myVar2', description: 'my var2 description'}
			],
			output;
		tag.addValue('$myVar2 my var2 description');
		output = tag.getArguments();

		for (var i = output.length - 1; i >= 0; i--) {
			expect(output[i].variable).toBe(expected[i].variable);
			expect(output[i].description).toBe(expected[i].description);
		}
	});
});