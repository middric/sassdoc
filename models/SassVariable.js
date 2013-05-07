var e = require('../config/exceptions.js'),
	fs = require('fs'),
	SassVariable = function () {
	var startRecording = function (line) {
			return line.match(/^(\/\/|\s*\*)\s*@variable/i);
		},
		isColor = function (variable) {
			return variable.match(/#[0-9a-f]{3,6}/i);
		}

	return {
		getVariables: function(data) {
			var lines = data.split("\n"),
				variables = [],
				package = '',
				record = false,
				obj, name, value, sass;

			for (var i = 0; i < lines.length; i++) {

				if (startRecording(lines[i])) {
					obj = {};
					record = true;
					continue;
				}
				if (record) {
					name = lines[i].match(/\$[^:]+/);
					value = lines[i].match(/([^:\s;]+);?$/);
					if (name && value) {
						obj = {
							name: name[0],
							value: value[1],
							sass: lines[i]
						};
						if (isColor(value[1])) {
							obj.isColor = true;
						}
						variables.push(obj);
						record = false;
					}
				}
			}

			return variables;
		}
	};
};

module.exports = new SassVariable();