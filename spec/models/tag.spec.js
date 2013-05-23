var Tag = require('../../models/Tag.js'),
	NameTag = require('../../models/Tags/NameTag'),
	e = require('../../config/exceptions.js');

describe('Tag', function () {
	it("should validate correctly formatted tags", function () {
		var tag = ' * @variable';
		expect(Tag.isValid(tag)).toBeTruthy();
	});

	it("should return false for invalid tags", function () {
		var tag = 'not a valid tag';
		expect(Tag.isValid(tag)).toBe(false);
	});

	it("should correctly identify markup blocks", function () {
		expect(Tag.isMarkup(' * This is markup')).toBeTruthy();
		expect(Tag.isMarkup(' * <this>is also markup')).toBeTruthy();
		expect(Tag.isMarkup(' * @this is too')).toBeTruthy();
	});

	it("should create the correct tag object", function () {
		var tag = Tag.getTag('name', 'value');
		expect(tag.name).toBe('name');
	});

	it("should throw an error with unknown tags", function () {
		expect(function () {
			var line = ' * @invalid Value',
				tag = Tag.getTag(line);
		}).toThrow(new e.InvalidTag());
	});
});