var chalk = require('chalk');
var fs = require('fs');
var nconf = require('nconf');

nconf.file({ file: 'config.json' });

var mode;
var circleOfFifths = nconf.get('circleOfFifths');
var accidental = nconf.get('accidental');
var pitches = nconf.get('pitches');

/**
 * Returns the abc notation string from given input
 * @param {object} input - The parsed input from input file
 * @retruns {string}
 */
function getAbcString(input) {
  var outputData = "";
  outputData += "X:"
    + input.id
    + "\n";
  outputData += "T:"
    + input.id
    + "\n";
  outputData += "M:"
    + input.attributes.time.beats
    + "/"
    + input.attributes.time["beat-type"]
    + "\n";
  outputData += "L:"
    + "1/"
    + (input.attributes.divisions * input.attributes.time["beat-type"])
    + "\n";
  outputData += "K:"
    + getAbcKey(input.attributes.key.fifths, input.attributes.key.mode)
    + "\n";

  for (var i = 0; i < input.measures.length; i++) {
    var measure = input.measures[i];
    if (measure.attributes.repeat.left) {
      outputData += "\n"
        + "|:";
    } else {
      //outputData += "|";
    }

    for (var j = 0; j < measure.notes.length; j++) {

      outputData += " "
        + getAbcNote(measure.notes[j]);
    }

    if (measure.attributes.repeat.right) {
      outputData += ":|"
        + "\n";
    } else {
      outputData += "|";
    }

  }

  return outputData;
}

/**
 * Returns the key for abc notation from given fifths
 * @param {number} fifths - The position inside the circle of fifths
 * @param {string|undefined} mode - The mode (major / minor)
 * @retruns {string}
 */
function getAbcKey(fifths, mode) {
  if (typeof mode === 'undefined') mode = 'major';
  return circleOfFifths[mode][fifths];
}

/**
 * Returns a note in abc notation from given note object (JSON)
 * @param {object} note - The note that should be transformed to abc
 * @returns {string}
 */
function getAbcNote(note) {
  // check if rest
  if (note.rest) {
    // return rest as abc
    return "z" + note.duration;
  } else {
    // return note as abc
    return accidental[note.pitch.accidental]
      + pitches[note.pitch.octave][note.pitch.step]
      + note.duration;
  }
}


/**
 * Returns a string in abc notation from given data
 * @param {object} data - The JSON data that should be transformed to abc
 * @returns {string}
 */
exports.convert2Abc = function(data) {
  return getAbcString(JSON.parse(data));
}

// Run with: musicjson2abc example.json

// Run jsdoc with: jsdoc index.js -d doc -R README.md
