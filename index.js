var circleOfFifths = {
  "major": { "-7": "B", "-6": "F#", "-5": "Db", "-4": "Ab", "-3": "Eb", "-2": "Bb", "-1": "F", "0" : "C", "1" : "G", "2" : "D", "3" : "A", "4" : "E", "5" : "B", "6" : "F#", "7" : "Db" },
  "minor": { "-7": "G#", "-6": "D#", "-5": "Bb", "-4": "F", "-3": "C", "-2": "G", "-1": "D", "0" : "A", "1" : "E", "2" : "B", "3" : "F#", "4" : "C#", "5" : "G#", "6" : "D#", "7" : "Bb" }
};
var accidental = {
  "flat-flat": "__",
  "flat": "_",
  "natural": "=",
  "sharp" : "^",
  "sharp-sharp" : "^^",
  "undefined" : ""
};
var pitches = {
  "1": { "A": "A,,,", "B": "B,,,", "C": "C,,,", "D": "D,,,", "E": "E,,,", "F": "F,,,", "G": "G,,," },
  "2": { "A": "A,,", "B": "B,,", "C": "C,,", "D": "D,,", "E": "E,,", "F": "F,,", "G": "G,," },
  "3": { "A": "A,", "B": "B,", "C": "C,", "D": "D,", "E": "E,", "F": "F,", "G": "G," },
  "4": { "A": "A", "B": "B", "C": "C", "D": "D", "E": "E", "F": "F", "G": "G" },
  "5": { "A": "a", "B": "b", "C": "c", "D": "d", "E": "e", "F": "f", "G": "g" },
  "6": { "A": "a'", "B": "b'", "C": "c'", "D": "d'", "E": "e'", "F": "f'", "G": "g'" },
  "7": { "A": "a''", "B": "b''", "C": "c''", "D": "d''", "E": "e''", "F": "f''", "G": "g''" },
  "8": { "A": "a'''", "B": "b'''", "C": "c'''", "D": "d'''", "E": "e'''", "F": "f'''", "G": "g'''" }
};
var fields = {
  "X": "id",
  "M": "meter",
  "L": "length",
  "K": "key"
};

var durations = {
  "1": "whole",
  "0.5": "half",
  "0.25": "quarter",
  "0.125": "eighth",
  "0.0625": "16th",
  "0.03125": "32th",
  "0.015625": "64th"
};

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
  // TODO
  var outputData = {};
  var fragments = input.split('X:');
  var preamble = fragments[0];
  console.log(preamble);
  outputData.id = preamble;

  // console.log(input);
  return outputData;
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
 */
function getJSONId(data) {

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
