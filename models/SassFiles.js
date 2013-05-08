var e = require('../config/exceptions.js'),
	fs = require('fs'),
	buf = require('buffer'),
	wrench = require('wrench'),
	SassFiles = function () {

	return {
		dir: null,
		files: null,

		findFiles: function(dir) {
			this.dir = dir + '/';
			try {
				this.files = wrench.readdirSyncRecursive(dir);
			} catch(err) {
				throw new e.DirectoryDoesNotExist();
			}

			for (var i = 0; i < this.files.length; i++) {
				if(!this.files[i].match(/\.(sass|scss)$/)) {
					delete this.files[i];
				}
			}
			this.files = this.files.filter(function () { return true; });
		},

		readFiles: function () {
			var output = [];

			for (var i = 0; i < this.files.length; i++) {
				output.push(this.readFile(this.files[i]));
			}

			return output;
		},

		readFile: function(file) {
			var output;
			try {
				output = fs.readFileSync(this.dir + file);
			} catch(err) {
				throw new e.UnableToReadFile();
			}

			output = this.readBuffer(output);
			return {filename: this.dir + file, output: output};
		},

		readBuffer: function (buffer) {
			return buffer.toString();
		}
	};
};

module.exports = new SassFiles();