var circleOfFifths = {
  "major": {
    "-7": "Cb",
    "-6": "Gb",
    "-5": "Db",
    "-4": "Ab",
    "-3": "Eb",
    "-2": "Bb",
    "-1": "F",
    "0": "C",
    "1": "G",
    "2": "D",
    "3": "A",
    "4": "E",
    "5": "B",
    "6": "F#",
    "7": "C#"
  },
  "minor": {
    "-7": "Abm",
    "-6": "Ebm",
    "-5": "Bbm",
    "-4": "Fm",
    "-3": "Cm",
    "-2": "Gm",
    "-1": "Dm",
    "0" : "Am",
    "1" : "Em",
    "2" : "Bm",
    "3" : "F#m",
    "4" : "C#m",
    "5" : "G#m",
    "6" : "D#m",
    "7" : "A#m"
  }
};
var accidental = {
  "json": {
    "flat-flat": "__",
    "flat": "_",
    "natural": "=",
    "sharp" : "^",
    "sharp-sharp" : "^^",
    "undefined" : ""
  },
  "abc": {
    "flat": -1,
    "sharp": 1
  }
};
var pitches = {
  "json": {
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
  },
  "abc": {
    "0": "C",
    "1": "D",
    "2": "E",
    "3": "F",
    "4": "G",
    "5": "A",
    "6": "B"
  }
};
var durations = [
  {
    "type": "whole",
    "duration": 1
  },
  {
    "type": "half",
    "duration": 0.5
  },
  {
    "type": "quarter",
    "duration": 0.25
  },
  {
    "type": "eighth",
    "duration": 0.125
  },
  {
    "type": "16th",
    "duration": 0.0625
  },
  {
    "type": "32th",
    "duration": 0.03125
  },
  {
    "type": "64th",
    "duration": 0.015625
  }
];
var clefs = {
  "G": "treble",
  "F": "bass",
  "C": "alto"
};

var Parser = require('./lib/abc_parser');

/**
 * Returns the abc notation string from given input
 * @param {object} input - The parsed input from input file
 * @returns {string}
 */
function convertJsonToAbc(input) {
  var outputData = "";
  outputData += "X:1\n";
  if (typeof input.id !== 'undefined') {
    outputData += "T:"
      + input.id
      + "\n";
  }
  outputData += "M:"
    + input.attributes.time.beats
    + "/"
    + input.attributes.time["beat-type"]
    + "\n";
  outputData += "L:"
    + "1/"
    + (input.attributes.divisions * 4)
    + "\n";
  outputData += "K:"
    + getAbcKey(input.attributes.key.fifths, input.attributes.key.mode)
    + "\n";
  outputData += "K:"
    + getAbcClef(input.attributes.clef.sign)
    + "\n";

  for (var i = 0; i < input.measures.length; i++) {
    if (i % 4 === 0 && i > 0) { // 4 measures per line
      outputData += "\n";
      outputData += "|";
    }
    var measure = input.measures[i];
    if (measure.attributes.repeat.left === true || measure.attributes.repeat.left === 'true') {
      outputData += ":";
    }

    for (var j = 0; j < measure.notes.length; j++) {

      outputData += getAbcNote(measure.notes[j-1], measure.notes[j]);
    }

    if (measure.attributes.repeat.right === true || measure.attributes.repeat.right === 'true') {
      outputData += ":";
    }
    outputData += "|";

  }

  return outputData;
}

/**
 * Returns the abc notation string from given input
 * @param {object} input - The parsed input from input file
 * @returns {string}
 */
function convertAbcToJson(input) {
  var outputData = {};
  var parser = new Parser();
  parser.parse(input);
  var tune = parser.getTune();
  outputData = createJsonFromLines(tune);
  outputData.id = getJsonId(input);

  return JSON.stringify(outputData);
}

function convertXmlToJson(input, id) {
  var outputData = {};
  outputData.id = id;
  outputData.measures = [];

  var score = input['score-partwise'].part;
  // console.log(score);
  if (score instanceof Array) {
    throw new Error('Multi-Part data is not supported');
  }

  var measures = score.measure;
  for (var i = 0; i < measures.length; i++) {
    // console.log(measures[i]);
    if (measures[i].hasOwnProperty('attributes')) {
      outputData.attributes = parseXmlAttributes(measures[i].attributes);
    }
    outputData.measures.push({
      attributes: {
        repeat: {
          left: false,
          right: false
        }
      },
      notes: parseXmlNotes(measures[i].note)
    });
  }

  return JSON.stringify(outputData);
}

/**
 * Returns the key for abc notation from given fifths
 * @param {number} fifths - The position inside the circle of fifths
 * @param {string|undefined} mode - The mode (major / minor)
 * @returns {string}
 */
function getAbcKey(fifths, mode) {
  if (typeof mode === 'undefined' || mode === null) mode = 'major';
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
 * NOTE: min duration is 2
 * @param {object} prevNote - The previous note
 * @param {object} curNote - The note that should be transformed to abc
 * @returns {string}
 */
function getAbcNote(prevNote, curNote) {
  var _accidental = '';
  if (typeof curNote.pitch.accidental !== 'undefined' && parseInt(curNote.pitch.accidental) !== 0) {
    _accidental = accidental.json[curNote.pitch.accidental];
  }
  var _pitch = pitches.json[parseInt(curNote.pitch.octave)][curNote.pitch.step];
  var _duration = parseInt(curNote.duration);
  if (typeof prevNote !== 'undefined') {
    if (prevNote.dot) {
      _duration = _duration * 2;
    }
  }
  var _dotted = '';
  if (curNote.dot === true || curNote.dot === 'true') {
    _duration = _duration / 1.5;
    _dotted = '>';
  }

  // check if rest
  if (curNote.rest === true || curNote.rest === 'true') {
    // return rest as abc
    return "z" + _duration + _dotted;
  } else {
    // return note as abc
    return _accidental + _pitch + _duration + _dotted;
  }
}

/**
 * Get id from abc string
 * @param {String} data - The abc string
 * @returns {string}
 */
var getJsonId = function getJSONId(data) {
  var lines = data.split('\n');
  for (var i = 0; i < lines.length; i++) {
    if (lines[i].indexOf('T:') > -1) {
      return lines[i].substr(lines[i].indexOf(':') + 1, lines[i].length);
    }
  }
  throw new Error('Could not determine "T:" field');
};

/**
 * Creates json object from abc tunes object
 * @param {object} tune - The parsed tune object
 * @returns {object}
 */
var createJsonFromLines = function(tune) {
  var ret = {
    attributes: {
      divisions: 1 /tune.getBeatLength(),
      clef: {
        line: 2
      },
      key: {},
      time: {}
    }
  };
  var measures = [];
  var measureCounter = 0;
  var barlineCounter = 0;

  // parse lines
  for (var l = 0; l < tune.lines.length; l++) {
    for (var s = 0; s < tune.lines[l].staff.length; s++) {
      var staff = tune.lines[l].staff[s];

      // parse default clef, key, meter
      if (l === 0 && s === 0) {
        ret.attributes.clef.sign = getKeyByValue(clefs, staff.clef.type);
        ret.attributes.clef.line = staff.clef.clefPos / 2;
        ret.attributes.key.fifths = parseInt(getKeyByValue(circleOfFifths, staff.key.root));
        ret.attributes.time.beats = staff.meter.value[0].num;
        ret.attributes.time['beat-type'] = staff.meter.value[0].den;
      }

      for (var v = 0; v < staff.voices.length; v++) {
        for (var t = 0; t < staff.voices[v].length; t++) {
          var token = staff.voices[v][t];

          // init measure if none exists
          if (measures[measureCounter] === undefined) {
            measures[measureCounter] = new Measure();
          }

          switch (token.el_type) {
            case "note":
              measures[measureCounter].addNote(token, ret.attributes.divisions, ret.attributes.time['beat-type']);
              break;
            case "bar":
              if (token.type === 'bar_right_repeat') {
                measures[measureCounter].setRepeatRight();
              }
              measureCounter++;
              if (measures[measureCounter] === undefined) {
                measures[measureCounter] = new Measure();
              }
              if (token.type === 'bar_left_repeat') {
                measures[measureCounter].setRepeatLeft();
              }
              break;
            default:
              console.log(token);
              break;
          }
        }
      }
    }
  }

  // put measures together
  ret.measures = [];
  for (var i = 0; i < measures.length; i++) {
    var measure = measures[i].get();
    if (measure.notes.length > 0) {
      ret.measures.push(measure);
    }
  }
  return ret;
};

/**
 * Constructor for measure objects
 * @constructor
 */
var Measure = function() {
  var attributes = {
    repeat: {
      left: false,
      right: false
    }
  };
  var notes = [];

  /**
   * Set repeat left for measure
   */
  this.setRepeatLeft = function () {
    attributes.repeat.left = true;
  };

  /**
   * Set repeat right for measure
   */
  this.setRepeatRight = function () {
    attributes.repeat.right = true;
  };

  /**
   * Add note to measure
   * @param {object} note - The note object
   * @param {Number} divisions - The calculated divisions
   * @param {Number} beatType - The beat type
   */
  this.addNote = function(note, divisions, beatType) {
    var _note = {pitch:{}};
    var _octave = 5, _step, _alter = 0;
    if (note.hasOwnProperty('pitches')) {
      _octave--;
      _step = note.pitches[0].pitch;
      while (_step > 6) {
        _octave++;
        _step -= 7;
      }
      while (_step < 0) {
        _octave--;
        _step +=7
      }
      _note.pitch.step = pitches.abc[_step];
      _note.rest = false;
      if (note.pitches[0].hasOwnProperty('accidental')) {
        _alter = accidental.abc[note.pitches[0].accidental];
        _note.pitch.accidental = note.pitches[0].accidental;
      }
    } else {
      _note.pitch.step = "C";
      _note.pitch.octave = 5;
      _note.rest = true;
      _note.pitch.alter = 0;
    }
    _note.pitch.octave = _octave;
    _note.pitch.alter = _alter;

    for (var i = 0; i < durations.length; i++) {
      if (typeof durations[i+1] !== 'undefined') {
        if (durations[i].duration > note.duration && durations[i+1].duration <= note.duration) {
          var diff = note.duration - durations[i+1].duration;
          _note.duration = durations[i+1].duration * divisions * beatType;
          _note.type = durations[i+1].type;
          if (diff > 0) {
            if ((diff / durations[i+1].duration) === 0.5) {
              _note.dot = true;
            } else {
              throw new Error('Unknown duration: ' + note.duration);
            }
          }
          break;
        }
      } else {
        throw new Error('Unknown duration: ' + note.duration);
      }
    }

    notes.push(_note);
  };

  /**
   * Get measure object
   * @returns {{attributes: {repeat: {left: boolean, right: boolean}}, notes: Array}}
   */
  this.get = function() {
    return {
      attributes: attributes,
      notes: notes
    };
  };
};

/**
 * Get object key by value
 * @param {object} object - The object to search in
 * @param {string} value - The value to search for
 * @returns {string}
 */
var getKeyByValue = function(object, value) {
  for (var key in object) {
    if (!object.hasOwnProperty(key)) continue;
    if (typeof object[key] === 'object') {
      return getKeyByValue(object[key], value);
    } else {
      if (object[key] == value) return key;
    }
  }
};

var parseXmlAttributes = function(attributes) {
  var ret = {
    'clef': {
      'line': 2,
      'sign': 'G'
    },
    'key': {
      'fifths': 0
    },
    'time': {
      'beats': 4,
      'beat-type': 4
    },
    'divisions': 1
  };

  for (var i = 0; i < attributes.length; i++) {
    if (attributes[i].hasOwnProperty('divisions')) {
      ret.divisions = parseInt(attributes[i].divisions);
    }
    if (attributes[i].hasOwnProperty('key')) {
      ret.key.fifths = parseInt(attributes[i].key.fifths);
      ret.key.mode = parseInt(attributes[i].key.mode);
    }
    if (attributes[i].hasOwnProperty('time')) {
      ret.time.beats = parseInt(attributes[i].time.beats);
      ret.time['beat-type'] = parseInt(attributes[i].time['beat-type']);
    }
  }

  return ret;
};

var parseXmlNotes = function(notes) {
  var ret = [];
  if (!(notes instanceof Array)) {
    notes = [notes];
  }

  for (var i = 0; i < notes.length; i++) {
    var tempNote = {
      pitch: {
        step: 'C',
        octave: 5,
        alter: 0
      },
      rest: false,
      duration: 2,
      type: 'quarter'
    };
    if (typeof notes[i].pitch !== 'undefined') {
      if (typeof notes[i].pitch.step !== 'undefined') tempNote.pitch.step = notes[i].pitch.step;
      if (typeof notes[i].pitch.octave !== 'undefined') tempNote.pitch.octave = parseInt(notes[i].pitch.octave);
      if (typeof notes[i].pitch.alter !== 'undefined') tempNote.pitch.alter = parseInt(notes[i].pitch.alter);
      if (typeof notes[i].pitch.accidental !== 'undefined') tempNote.pitch.accidental = notes[i].pitch.accidental;
    }
    if (typeof notes[i].rest !== 'undefined') tempNote.rest = notes[i].rest;
    if (typeof notes[i].dot !== 'undefined') tempNote.dot = notes[i].dot;
    if (typeof notes[i].duration !== 'undefined') tempNote.duration = parseInt(notes[i].duration);
    if (typeof notes[i].type !== 'undefined') tempNote.type = notes[i].type;
    ret.push(tempNote);
  }

  return ret;
};

/**
 * Returns a string in abc notation from given data
 * @param {object} data - The JSON string data that should be transformed to abc
 * @returns {string}
 */
exports.json2abc = function(data) {
  return convertJsonToAbc(data);
};

/**
 * Returns a string in json notation from given abc data
 * @param {object} data - The abc string that should be transformed to json
 * @returns {string}
 */
exports.abc2json = function(data) {
  return convertAbcToJson(data);
};

/**
 * Returns a string in json notation from given xml data
 * @param {object} data - The music xml that should be transformed to json
 * @returns {string}
 */
exports.xml2json = function(data, id) {
  return convertXmlToJson(data, id);
};
