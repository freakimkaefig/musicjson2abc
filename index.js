var circleOfFifths = require('./dict/circleOfFifths.json');
var accidental = require('./dict/accidentals.json');
var pitches = require('./dict/pitches.json');
var durations = require('./dict/durations.json');
var clefs = require('./dict/clefs.json');

/**
 * Returns the abc notation string from given input
 * @param {object} input - The parsed input from input file
 * @returns {string}
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
  outputData += "K:"
    + getAbcClef(input.attributes.clef.sign)
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
        + getAbcNote(measure.notes[j-1], measure.notes[j]);
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
 * Returns the abc notation string from given input
 * @param {object} input - The parsed input from input file
 * @returns {string}
 */
function getMusicJSON(input) {
  var outputData = {};

  outputData.id = getJSONId(input);
  return JSON.stringify(outputData);
}

/**
 * Returns the key for abc notation from given fifths
 * @param {number} fifths - The position inside the circle of fifths
 * @param {string|undefined} mode - The mode (major / minor)
 * @returns {string}
 */
function getAbcKey(fifths, mode) {
  if (typeof mode === 'undefined') mode = 'major';
  return circleOfFifths[mode][fifths];
}

/**
 * Returns the key for abc notation from given fifths
 * @param {string} sign - The clef sign
 * @returns {string}
 */
function getAbcClef(sign) {
  return clefs[sign];
}

/**
 * Returns a note in abc notation from given note object (JSON)
 * @param {object} prevNote - The previous note
 * @param {object} curNote - The note that should be transformed to abc
 * @returns {string}
 */
function getAbcNote(prevNote, curNote) {
  var _accidental = accidental[curNote.pitch.accidental];
  var _pitch = pitches[curNote.pitch.octave][curNote.pitch.step];
  var _duration = curNote.duration;
  if (typeof prevNote !== 'undefined') {
    if (prevNote.dot) {
      _duration = _duration * 2;
    }
  }
  var _dotted = '';
  if (curNote.dot) {
    _dotted = '>';
  }

  // check if rest
  if (curNote.rest) {
    // return rest as abc
    return "z" + _duration + _dotted;
  } else {
    // return note as abc
    return _accidental + _pitch + _duration + _dotted;
  }
}

/**
 * Parse id from abc
 * @param {string} data - The input data
 */
function getJSONId(data) {
  var lines = data.split('\n');
  for (var i = 0; i < lines.length; i++) {
    if (lines[i].indexOf('X:') > -1) {
      return lines[i].substr(lines[i].indexOf(':') + 1, lines[i].length);
    }
  }

  throw new Error('Could not determine "X:" field in abc');
}


}


/**
 * Returns a string in abc notation from given data
 * @param {object} data - The JSON data that should be transformed to abc
 * @returns {string}
 */
exports.convert2Abc = function(data) {
  return getAbcString(JSON.parse(data));
};

exports.convert2JSON = function(data) {
  return getMusicJSON(data);
};

// Run jsdoc with: jsdoc index.js -d doc -R README.md
