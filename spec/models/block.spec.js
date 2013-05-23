var Block = require('../../models/Block.js'),
	Files = require('../../models/Files.js'),
	e = require('../../config/exceptions.js');

describe('Block', function () {
	var file, app, blocks;
	beforeEach(function () {
		Files.dir = '';
		file = Files.readFile('spec/fixtures/sass/styles.scss'),
		app = require('express')(),
		blocks = Block.getBlocks(file, app);

		for (var i = blocks.length - 1; i >= 0; i--) {
			blocks[i].parse();
		}
	});

	it("should sort by block type", function () {
		var blocks = [
				{isVariable: true},
				{isVariable: false},
				{isVariable: false},
				{isVariable: true},
				{isVariable: true},
				{isVariable: false}
			],
			expected = [
				{isVariable: true},
				{isVariable: true},
				{isVariable: true},
				{isVariable: false},
				{isVariable: false},
				{isVariable: false}
			];
		expect(Block.sort(blocks)).toEqual(expected);
	});

	it("should return blocks in a file", function () {
		expect(blocks.length).toBe(3);
		expect(typeof blocks[0].getID).toBe('function');
	});

	it("should have detected lines of Sass", function () {
		expect(blocks[0].getLines().length).toBeTruthy();
	});

	it("should be able to parse Sass", function () {
		expect(blocks[0].getID()).toBe('test');
	});

	it("should detect variables", function () {
		expect(blocks[0].isVariable).not.toBeTruthy();
		expect(blocks[2].isVariable).toBeTruthy();
	});

	it("should contain Sass", function () {
		expect(blocks[0].getSass()).toBeTruthy();
	});

	it("should contain markup", function () {
		expect(blocks[0].getMarkup()).toBeTruthy();
	});

	it("should be able to retrieve a tag", function () {
		expect((blocks[0].getTag('name'))[0].getName()).toBe('name');
		expect((blocks[0].getTag('name'))[0].getValue()).toBe('Test');
	});

	it("should be able to retrieve a tag value", function () {
		expect(blocks[0].getTagValue('name')).toBe('Test');
	});

	it("should list the imports", function () {
		app.set('configuration', {
			useCompass: true,
			root: '',
			sassDirectory: 'sass',
			imports: [
				'globalImport'
			]
		});

		expect(blocks[0].getImports()).toBe("@import \"compass\";\n" +
			"@import \"/sass/globalImport\";\n" +
			"@import \"/sass/anotherfile\";");
	});

	it("should get external CSS dependencies", function () {
		app.set('configuration', {
			externalCSS: [
				'myCSS.css'
			]
		});

		expect(blocks[0].getExternal()).toBe("<link href=\"myCSS.css\" rel=\"stylesheet\" /><link href=\"anothercss\" rel=\"stylesheet\" />");
	});

	it("should get generated CSS", function () {
		app.set('configuration', {
			useCompass: true,
			root: '',
			sassDirectory: 'sass'
		});

		expect(blocks[1].getCSS()).toBe(
			".anothertest body {\n" +
			"  background: red;\n" +
			"}\n"
		);
	});
});