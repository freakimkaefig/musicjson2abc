#!/usr/bin/env node
var program = require('commander'),
	chalk = require('chalk'),
	fs = require('fs'),
	mode,
	inputFile,
	outputFile,

	circle_of_fifths = {
		"major": {
			"-7": "B",
			"-6": "F#",
			"-5": "Db",
			"-4": "Ab",
			"-3": "Eb",
			"-2": "Bb",
			"-1": "F",
			"0" : "C",
			"1" : "G",
			"2" : "D",
			"3" : "A",
			"4" : "E",
			"5" : "B",
			"6" : "F#",
			"7" : "Db"
		},
		"minor": {
			"-7": "G#",
			"-6": "D#",
			"-5": "Bb",
			"-4": "F",
			"-3": "C",
			"-2": "G",
			"-1": "D",
			"0" : "A",
			"1" : "E",
			"2" : "B",
			"3" : "F#",
			"4" : "C#",
			"5" : "G#",
			"6" : "D#",
			"7" : "Bb"
		}
	},

	accidental = {
		"flat-flat": "__",
		"flat": "_",
		"natural": "=",
		"sharp" : "^",
		"sharp-sharp" : "^^",
		"undefined" : ""
	},

	pitches = {
		"1": {
			"A": "A,,,",
			"B": "B,,,",
			"C": "C,,,",
			"D": "D,,,",
			"E": "E,,,",
			"F": "F,,,",
			"G": "G,,,"
		},
		"2": {
			"A": "A,,",
			"B": "B,,",
			"C": "C,,",
			"D": "D,,",
			"E": "E,,",
			"F": "F,,",
			"G": "G,,"
		},
		"3": {
			"A": "A,",
			"B": "B,",
			"C": "C,",
			"D": "D,",
			"E": "E,",
			"F": "F,",
			"G": "G,"
		},
		"4": {
			"A": "A",
			"B": "B",
			"C": "C",
			"D": "D",
			"E": "E",
			"F": "F",
			"G": "G"
		},
		"5": {
			"A": "a",
			"B": "b",
			"C": "c",
			"D": "d",
			"E": "e",
			"F": "f",
			"G": "g"
		},
		"6": {
			"A": "a'",
			"B": "b'",
			"C": "c'",
			"D": "d'",
			"E": "e'",
			"F": "f'",
			"G": "g'"
		},
		"7": {
			"A": "a''",
			"B": "b''",
			"C": "c''",
			"D": "d''",
			"E": "e''",
			"F": "f''",
			"G": "g''"
		},
		"8": {
			"A": "a'''",
			"B": "b'''",
			"C": "c'''",
			"D": "d'''",
			"E": "e'''",
			"F": "f'''",
			"G": "g'''"
		}
	};

program
	.version('0.0.1')
	.arguments('<input> [output]')
	.action(function(input, output) {
		inputFile = input;
		outputFile = output;
	});

program.on('--help', function() {
	console.log('  Examples:');
	console.log('');
	console.log('    $ musicjson2abc input.json output.abc');
	console.log('    $ musicjson2abc example.json example.abc');
	console.log('');
	console.log('  Hint:');
	console.log('');
	console.log('    The input file should be a valid musicJSON file');
	console.log('    The output file will become a valid abc file. May overwrite existing files.');
	console.log('');
});

program.parse(process.argv);

if (typeof inputFile === 'undefined') {
	console.error(chalk.bold.red('ERROR: No input file specified.'));
	console.info(chalk.cyan('Run musicjson2abc -h for further information.'));
	process.exit(1);
}
if (typeof outputFile === 'undefined') {
	outputFile = inputFile.replace(/\.[^/.]+$/, "") + ".abc";
	console.info(chalk.cyan('INFO: No output file specified.'));
	console.info(chalk.cyan('Defaults to', outputFile));
}

read_input(inputFile);


function read_input(file) {
	fs.readFile(file, 'utf8', function(err, data) {
		if (err) {
			console.error(chalk.bold.red('ERROR:', err));
			process.exit(1);
		}
		convert(JSON.parse(data));
	});
}

function convert(input) {
	var outputData = "";
	console.log(input);
	outputData += "X:" + input.id + "\n";
	outputData += "T:" + input.id + "\n";
	outputData += "M:" + input.attributes.time.beats + "/" + input.attributes.time["beat-type"] + "\n";
	outputData += "L:" + "1/" + (input.attributes.divisions * input.attributes.time["beat-type"]) + "\n";
	outputData += "K:" + get_abc_key(input.attributes.key.fifths, input.attributes.key.mode) + "\n";
	
	for (var i = 0; i < input.measures.length; i++) {
		var measure = input.measures[i];
		if (measure.attributes.repeat.left) {
			outputData += "\n" + "|:";
		} else {
			//outputData += "|";
		}

		for (var j = 0; j < measure.notes.length; j++) {

			outputData += " " + get_abc_note(measure.notes[j]);
		}

		if (measure.attributes.repeat.right) {
			outputData += ":|" + "\n";
		} else {
			outputData += "|";
		}

	}
	console.log(outputData);

	write_output(outputFile, outputData);
}

function write_output(file, data) {
	fs.writeFile(file, data, function(err) {
		if(err) {
			console.error(chalk.bold.red('ERROR:', err));
			process.exit(1);
		}

		console.info(chalk.cyan('Output written to', outputFile));
	});
}

function get_abc_key(fifths, mode) {
	return circle_of_fifths[mode][fifths];
}

function get_abc_note(note) {
	// check if rest
	if (note.rest) {
		// return rest as abc
		return "z" + note.duration;
	} else {
		// return note as abc
		return accidental[note.pitch.accidental] + pitches[note.pitch.octave][note.pitch.step] + note.duration;
	}
}

// Run with: musicjson2abc example.json
