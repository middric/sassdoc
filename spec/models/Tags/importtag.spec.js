var ImportTag = require('../../../models/Tags/ImportTag'),
	e = require('../../../config/exceptions.js');

describe('Import tag model', function () {
	it("should return an array of import statements", function () {
		var tag = new ImportTag('import', 'to_import'),
			expected = ['@import "root_dir/to_import";'],
			output = tag.getImportStatements('root_dir');

		for (var i = output.length - 1; i >= 0; i--) {
			expect(output[i].variable).toBe(expected[i].variable);
			expect(output[i].description).toBe(expected[i].description);
		}
	});
	it("should return an array of multiple import statements", function () {
		var tag = new ImportTag('import', 'to_import'),
			expected = [
				'@import "root_dir/to_import";',
				'@import "root_dir/to_import2";'
			],
			output;

		tag.addValue('to_import2');
		output = tag.getImportStatements('root_dir');

		for (var i = output.length - 1; i >= 0; i--) {
			expect(output[i].variable).toBe(expected[i].variable);
			expect(output[i].description).toBe(expected[i].description);
		}
	});
});