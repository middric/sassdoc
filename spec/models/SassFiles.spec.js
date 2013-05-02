var SassFiles = require('../../models/SassFiles.js'),
	e = require('../../config/exceptions.js');

describe('SassFiles', function () {
	it("should throw an error reading a non existent directory", function () {
		expect(function () {
			SassFiles.findFiles('doesnt_exist');
		}).toThrow(new e.DirectoryDoesNotExist());
	});

	it("should create an array of files in the directory", function () {
		SassFiles.findFiles('spec/fixtures/sass');
		expect(Array.isArray(SassFiles.files)).toBeTruthy();
	});

	it("should filter out any non-sass files", function () {
		var files = ['styles.sass', 'styles.scss'];
		expect(SassFiles.files).toEqual(files);
	});

	it("should be able to read a file", function () {
		expect(SassFiles.readFile('styles.scss')).toBeTruthy();
	});

	it("should throw an exception on invalid files", function () {
		expect(function () {
			SassFiles.readFile('doesnt_exist');
		}).toThrow(new e.UnableToReadFile());
	})

	it("should be able to read all files", function () {
		var output = SassFiles.readFiles();
		expect(Array.isArray(output)).toBeTruthy();
		expect(output.length).toBeGreaterThan(0);
	})
});