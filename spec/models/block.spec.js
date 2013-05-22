var Block = require('../../models/Block.js'),
	Files = require('../../models/Files.js'),
	e = require('../../config/exceptions.js');

describe('Block', function () {
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
			]
		expect(Block.sort(blocks)).toEqual(expected);
	});

	it("should return blocks in a file", function () {
		Files.dir = '';
		var file = Files.readFile('spec/fixtures/sass/styles.scss'),
			app = require('express')(),
			blocks = Block.getBlocks(file, app);

		expect(blocks.length).toBe(3);
		expect(typeof blocks[0].getID).toBe('function');
	});

	it("should have detected lines of Sass", function () {
		Files.dir = '';
		var file = Files.readFile('spec/fixtures/sass/styles.scss'),
			app = require('express')(),
			blocks = Block.getBlocks(file, app);

		expect(blocks[0].getLines().length).toBeTruthy();
	});

	it("should be able to parse Sass", function () {
		Files.dir = '';
		var file = Files.readFile('spec/fixtures/sass/styles.scss'),
			app = require('express')(),
			blocks = Block.getBlocks(file, app);
		blocks[0].parse();

		expect(blocks[0].getID()).toBe('test');
	});

	it("should detect variables", function () {
		Files.dir = '';
		var file = Files.readFile('spec/fixtures/sass/styles.scss'),
			app = require('express')(),
			blocks = Block.getBlocks(file, app);
		blocks[0].parse();
		blocks[2].parse();

		expect(blocks[0].isVariable).not.toBeTruthy();
		expect(blocks[2].isVariable).toBeTruthy();
	});

	it("should contain Sass", function () {
		Files.dir = '';
		var file = Files.readFile('spec/fixtures/sass/styles.scss'),
			app = require('express')(),
			blocks = Block.getBlocks(file, app);
		blocks[0].parse();

		expect(blocks[0].getSass()).toBeTruthy();
	});

	it("should contain markup", function () {
		Files.dir = '';
		var file = Files.readFile('spec/fixtures/sass/styles.scss'),
			app = require('express')(),
			blocks = Block.getBlocks(file, app);
		blocks[0].parse();

		expect(blocks[0].getMarkup()).toBeTruthy();
	});

	it("should be able to retrieve a tag", function () {
		Files.dir = '';
		var file = Files.readFile('spec/fixtures/sass/styles.scss'),
			app = require('express')(),
			blocks = Block.getBlocks(file, app);
		blocks[0].parse();

		expect((blocks[0].getTag('name'))[0].getName()).toBe('name');
		expect((blocks[0].getTag('name'))[0].getValue()).toBe('Test');
	});

	it("should be able to retrieve a tag value", function () {
		Files.dir = '';
		var file = Files.readFile('spec/fixtures/sass/styles.scss'),
			app = require('express')(),
			blocks = Block.getBlocks(file, app);
		blocks[0].parse();

		expect(blocks[0].getTagValue('name')).toBe('Test');
	});

	it("should list the imports", function () {
		Files.dir = '';
		var file = Files.readFile('spec/fixtures/sass/styles.scss'),
			app = require('express')(),
			blocks = Block.getBlocks(file, app);
		app.set('configuration', {
			useCompass: true,
			root: '',
			sassDirectory: 'sass',
			imports: [
				'globalImport'
			]
		});
		blocks[0].parse();

		expect(blocks[0].getImports()).toBe("@import \"compass\";\n" +
			"@import \"/sass/globalImport\";\n" + 
			"@import \"/sass/anotherfile\";");
	});

	it("should get external CSS dependencies", function () {
		Files.dir = '';
		var file = Files.readFile('spec/fixtures/sass/styles.scss'),
			app = require('express')(),
			blocks = Block.getBlocks(file, app);
		app.set('configuration', {
			externalCSS: [
				'myCSS.css'
			]
		});
		blocks[0].parse();

		expect(blocks[0].getExternal()).toBe("<link href=\"myCSS.css\" rel=\"stylesheet\" /><link href=\"anothercss\" rel=\"stylesheet\" />");
	});

	it("should get generated CSS", function () {
		Files.dir = '';
		var file = Files.readFile('spec/fixtures/sass/styles.scss'),
			app = require('express')(),
			blocks = Block.getBlocks(file, app);
		app.set('configuration', {
			useCompass: true,
			root: '',
			sassDirectory: 'sass'
		});
		blocks[1].parse();

		expect(blocks[1].getCSS()).toBe(
			".anothertest body {\n" +
			"  background: red;\n" +
			"}\n"
		);
	});
});