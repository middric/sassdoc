var Files = require('../../models/Files.js'),
	e = require('../../config/exceptions.js');

describe('Files', function () {
	it("should throw an error if a file cannot be read", function () {
		expect(function () {
			Files.readFile('doesntexist');
		}).toThrow(new e.UnableToReadFile());
	});

	it("should return an object if a file can be read", function () {
		Files.dir = '';
		var file = Files.readFile('spec/fixtures/sass/styles.scss');
		expect(file.filename).toBe('spec/fixtures/sass/styles.scss');
	});

	it("should be able to read a number of files at once", function () {
		Files.dir = '';
		Files.files = ['spec/fixtures/sass/styles.scss', 'spec/fixtures/sass/styles.sass'];
		var files = Files.readFiles();

		for (var i = files.length - 1; i >= 0; i--) {
			expect(files[i].filename).toBe(Files.files[i]);
		}
	});

	it("should be able to find and read all of the files in a directory", function () {
		Files.dir = '';
		Files.files = null;
		Files.findFiles('spec/fixtures/sass');

		var files = Files.readFiles();

		for (var i = files.length - 1; i >= 0; i--) {
			expect(files[i].filename).toBe(Files.dir + Files.files[i]);
		}
	});
});