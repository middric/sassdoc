var Sass = require('../../models/Sass.js'),
	e = require('../../config/exceptions.js');
	app = require('express')();

app.set('configuration', {
	useCompass: false
});

beforeEach(function () {
	this.addMatchers({
		toThrowByName: function(expected) {
		  var result = false;
		  var exception;
		  if (typeof this.actual != 'function') {
		    throw new Error('Actual is not a function');
		  }
		  try {
		    this.actual();
		  } catch (e) {
		    exception = e;
		  }

		  if (exception) {
		      result = (expected === jasmine.undefined || this.env.equals_(exception.message || exception, expected.message || expected) || this.env.equals_(exception.name, expected));
		  }

		  var not = this.isNot ? "not " : "";

		  this.message = function() {
		    if (exception && (expected === jasmine.undefined || !this.env.equals_(exception.message || exception, expected.message || expected))) {
		      return ["Expected function " + not + "to throw", expected ? expected.name || expected.message || expected : " an exception", ", but it threw", exception.name || exception.message || exception].join(' ');
		    } else {
		      return "Expected function to throw an exception.";
		    }
		  };

		  return result;
		}
	});
});

describe('Sass', function () {
	it("should validate sass code", function () {
		expect(Sass.isValid('@mixin some sass')).toBeTruthy();
		expect(Sass.isValid('// a comment')).not.toBeTruthy();
		expect(Sass.isValid('/* a comment')).not.toBeTruthy();
		expect(Sass.isValid(' * ')).not.toBeTruthy();
		expect(Sass.isValid(' some stuff */')).not.toBeTruthy();
	});

	it("should throw an error on invalid sass", function () {
		expect(function () {
			Sass.parse('this is not sass', app);
		}).toThrowByName('UnableToParseSassException');
	});

	it("should compile", function () {
		var sass = Sass.parse('body { background: red }', app),
			expected = "body {\n" +
				"  background: red;\n" +
				"}\n";

		expect(sass).toBe(expected);
	});

	it("should fail to compile with compass if config set to false", function () {
		expect(function () {
			Sass.parse('@import "compass"; body { background: red; }', app);
		}).toThrowByName('UnableToParseSassException');
	});

	it("should compile with compass", function () {
		var sass = '',
			expected = "body {\n" +
				"  background: red;\n" + 
				"}\n";

		app.set('configuration', {
			useCompass: true
		});

		sass = Sass.parse('@import "compass"; body { background: red; }', app);

		expect(sass).toBe(expected);
	});
});