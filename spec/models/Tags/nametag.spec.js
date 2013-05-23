var NameTag = require('../../../models/Tags/NameTag'),
	e = require('../../../config/exceptions.js');

describe('Name tag model', function () {
	it("should throw an error on invalid tag", function () {
		expect(function () {
			new NameTag('invalid', 'value');
		}).toThrow(new e.InvalidTag());
	});

	it("should return a name tag", function () {
		var tag = new NameTag('name', 'value');

		expect(typeof tag).toBe('object');
		expect(tag instanceof NameTag).toBe(true);
	});

	it("should return its name and value", function () {
		var tag = new NameTag('name', 'value');

		expect(tag.getName()).toBe('name');
		expect(tag.getValue()).toBe('value');
	});

	it("should return an ID", function () {
		var tag = new NameTag('name', '  My very long name  '),
			expected = 'my_very_long_name';

		expect(tag.getID()).toBe(expected);
	});
});