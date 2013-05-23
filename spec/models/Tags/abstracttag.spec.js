var AbstractTag = require('../../../models/Tags/AbstractTag');

describe('Abstract tag model', function () {
	it("should return an abstract tag", function () {
		var tag = new AbstractTag('abstract', 'value', 'abstract');

		expect(typeof tag).toBe('object');
		expect(tag instanceof AbstractTag).toBe(true);
	});

	it("should return its name and value", function () {
		var tag = new AbstractTag('abstract', 'value', 'abstract');

		expect(tag.getName()).toBe('abstract');
		expect(tag.getValue()).toBe('value');
	});

	it("should return its variable state", function () {
		var tag = new AbstractTag('abstract', 'value', 'abstract');

		expect(tag.isVariable()).toBe(false);

		tag = new AbstractTag('variable', 'value', 'variable');
		expect(tag.isVariable()).toBe(true);
	});
});