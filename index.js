var circleOfFifths = require('./dict/circleOfFifths.json');
var accidental = require('./dict/accidentals.json');
var pitches = require('./dict/pitches.json');
var durations = require('./dict/durations.json');
var clefs = require('./dict/clefs.json');

var Parser = require('./lib/abc_parser');

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
      outputData += ":";
    }

    for (var j = 0; j < measure.notes.length; j++) {

      outputData += getAbcNote(measure.notes[j-1], measure.notes[j]);
    }

    if (measure.attributes.repeat.right) {
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
function getMusicJSON(input) {
  var outputData = {};
  var parser = new Parser();
  parser.parse(input);
  var tune = parser.getTune();
  outputData = createJsonFromLines(tune);
  outputData.id = getJsonId(input);

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
  var _accidental = accidental.json[curNote.pitch.accidental];
  var _pitch = pitches.json[curNote.pitch.octave][curNote.pitch.step];
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
 * Get id from abc string
 * @param data
 * @returns {string}
 */
var getJsonId = function getJSONId(data) {
  var lines = data.split('\n');
  for (var i = 0; i < lines.length; i++) {
    if (lines[i].indexOf('X:') > -1) {
      return lines[i].substr(lines[i].indexOf(':') + 1, lines[i].length);
    }
  }
  throw new Error('Could not determine "X:" field');
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
              measures[measureCounter].addNote(token, tune, ret.attributes.divisions, ret.attributes.time['beat-type']);
              break;
            case "bar":
              if (barlineCounter === 0) {
                measureCounter++;
                measures[measureCounter] = new Measure();
                if (token.type === 'bar_left_repeat') {
                  measures[measureCounter].setRepeatLeft();
                }
                if (token.type === 'bar_right_repeat') {
                  measures[measureCounter].setRepeatRight();
                }
              }
              break;
          }
        }
      }
    }
  }

  // put measures together
  ret.measures = [];
  for (var i = 0; i < measures.length; i++) {
    ret.measures[i] = measures[i].get();
  }
  return ret;
};

/**
 * Constructor for measure objects
 */
var Measure = function() {
  var attributes = {
    repeat: {
      left: false,
      right: false
    }
  };
  var notes = [];

  this.setRepeatLeft = function () {
    attributes.repeat.left = true;
  };
  this.setRepeatRight = function () {
    attributes.repeat.right = true;
  };

  this.addNote = function(note, tune, divisions, beatType) {
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
