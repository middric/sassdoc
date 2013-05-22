var Tag = require('../../models/tag.js'),
	e = require('../../config/exceptions.js');

describe('Tag', function () {
	it("should validate correctly formatted tags", function () {
		var tag;
		for (var i = Tag.tags.length - 1; i >= 0; i--) {
			tag = ' * @' + Tag.tags[i];
			expect(Tag.isValid(tag)).toBeTruthy();
		}
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

	it("should return a tag object", function () {
		var tag = Tag.isValid(' * @component'),
			match = new Tag('component', '');
		expect(tag.toString()).toBe(match.toString());
	});

	it("should return the tag name", function () {
		var tag = new Tag('component', '');
		expect(tag.getName()).toBe('component');
	});

	it("should return the tag value", function () {
		var tag = new Tag('component', 'value');
		expect(tag.getValue()).toBe('value');
	});

	it("should identify variables", function () {
		var tag = new Tag('component', 'value');
		expect(tag.isVariable()).toBe(false);

		tag = new Tag('variable', '');
		expect(tag.isVariable()).toBe(true);
	});
});