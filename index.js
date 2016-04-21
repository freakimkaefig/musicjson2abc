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
  outputData.attributes = getJSONClefAndKey(input);
  outputData.attributes.time = getJSONTime(input);
  outputData.attributes.divisions = getJSONDivisions(input, outputData.attributes.time['beat-type']);
  outputData.measures = getJSONMeasures(input); // TODO

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

/**
 * Parse key from abc
 * @param {string} data - The input data
 * @return {object}
 */
function getJSONClefAndKey(data) {
  var retFifths, retMode, retClef;
  var lines = data.split('\n');
  for (var i = 0; i < lines.length; i++) {
    if (lines[i].match(/^K:/)) {
      var key = lines[i].substr(lines[i].indexOf(':') + 1, lines[i].length);

      // Check if key is in circle of fifths
      for (var mode in circleOfFifths) {
        if (!circleOfFifths.hasOwnProperty(mode)) continue;
        var obj = circleOfFifths[mode];
        for (var prop in obj) {
          if (!obj.hasOwnProperty(prop)) continue;
          if (obj[prop] === key) {
            retFifths = parseInt(prop);
            retMode = mode;
          }
        }
      }

      // Check if key is a clef
      for (var sign in clefs) {
        if (!clefs.hasOwnProperty(sign)) continue;
        if (clefs[sign] == key) {
          retClef = sign;
        }
      }
    }
  }

  if (typeof retFifths !== 'undefined'
    && typeof retMode !== 'undefined'
    && typeof retClef !== 'undefined') {
    return {
      "clef": {"sign": retClef, "line": 2},
      "key": {"fifths": retFifths, "mode": retMode}
    };
  }

  throw new Error('Could not determine "K:" field in abc');
}

/**
 * Parse time / meter from abc
 * @param {string} data - The input data
 */
function getJSONTime(data) {
  var lines = data.split('\n');
  for (var i = 0; i < lines.length; i++) {
    if (lines[i].match(/^M:/)) {
      var meter = lines[i].substr(lines[i].indexOf(':') + 1, lines[i].length).split('/');
      return {
        "beats": parseInt(meter[0]),
        "beat-type": parseInt(meter[1])
      }
    }
  }

  throw new Error('Could not determine "M:" field in abc');
}

/**
 * Parse divisions from abc
 * @param {string} data - The input data
 * @param {int} beatType - The beat-type of the song
 */
function getJSONDivisions(data, beatType) {
  var lines = data.split('\n');
  for (var i = 0; i < lines.length; i++) {
    if (lines[i].match(/^L:/)) {
      var length = lines[i].substr(lines[i].indexOf(':') + 1, lines[i].length).split('/');
      return length[1] / beatType;
    }
  }

  throw new Error('Could not determine "L:" field in abc');
}

/**
 * Parse divisions from abc
 * @param {string} data - The input data
 */
function getJSONMeasures(data) {
  var retMeasures = [];
  var lines = data.split('\n');
  for (var i = lines.length - 1; i >= 0; i--) {
    if (lines[i].match(/^(X:|T:|C:|O:|A:|M:|L:|Q:|P:|Z:|N:|G:|H:|K:|R:|B:|D:|F:|S:|I:|m:|r:|s:|U:|V:|W:|w:)/)) {
      lines.splice(i, 1);
    } else if (lines[i].match(/^\s?$/)) {
      lines.splice(i, 1);
    }
  }

  for (var l = 0; l < lines.length; l++) {
    var measures = lines[l].split('|');
    for (var m = 0; m < measures.length; m++) {
      if (measures[m].match(/^\s*$/)) continue; // skip empty measures
      var tempMeasure = {attributes: {}, notes: []};

      // check repeat left & right
      tempMeasure.attributes.left = measures[m].match(/^:/) ? true : false;
      tempMeasure.attributes.right = measures[m].match(/:$/) ? true : false;

      // check notes
      var notes = measures[m].split(' ');
      for (var n = 0; n < notes.length; n++) {
        if (notes[n].match(/^\s*$/)) continue;  // skip spaces
        if (notes[n].match(/^:$/)) continue; // skip colons
        /* TODO:
         * - Notes can be grouped together with beams
         * - Notes can have specific duration or not
         * - RegEx: /^(__|_|=|\^|\^\^)?[a-zA-Z]{1}(,|'){0,3}[0-9]{0,2}$/
         */
        console.log("Note", m, n, notes[n]);

        var tempNote = {pitch: {}};

        for (var x = 0; x < notes[n].length; x++) {
          var char = notes[n][x];
          var prevChar = notes[n][x-1];
          console.log("Char", m, n, notes[n], char);
          // if (notes[n][x] === ' ') {
          //   continue;
          // }
          if (char === '_') {
            if (prevChar === '_') {
              tempNote.pitch.accidental = 'flat-flat';
              tempNote.pitch.alter = -2;
              continue;
            }
            tempNote.pitch.accidental = 'flat';
            tempNote.pitch.alter = -1;
            continue;
          }

          if (char === '=') {
            tempNote.pitch.accidental = 'natural';
            tempNote.pitch.alter = 0;
            continue;
          }

          if (char === '^') {
            if (prevChar === '^') {
              tempNote.pitch.accidental = 'sharp-sharp';
              tempNote.pitch.alter = 2;
              continue;
            }
            tempNote.pitch.accidental = 'sharp';
            tempNote.pitch.alter = 1;
            continue;
          }

          if (char.match(/[A-Za-z]/)) {
            tempNote.pitch.step = char.toUpperCase();
            if (char.match(/[A-Z]/)) {
              tempNote.pitch.octave = 4;
            }
            if (char.match(/[a-z]/)) {
              tempNote.pitch.octave = 5;
            }
            continue;
          }

          // accidental
          // if (notes[n][x].match(/^(_|=|\^)$/)) {
          //   console.log(m, n, notes[n], notes[n][x]);
          //   for (var acc in accidental) {
          //     if (!accidental.hasOwnProperty(acc)) continue;
          //     if (notes[n][x] === acc) {
          //       tempNote.pitch.accidental = accidental[acc];
          //     }
          //   }
          // }


          // step
          // for (var octave in pitches) {
          //   if (!pitches.hasOwnProperty(octave)) continue;
          //   for (var step in pitches[octave]) {
          //     if (!pitches[octave].hasOwnProperty(step)) continue;
          //     if (notes[n][x] === step) {
          //
          //     }
          //   }
          // }

          console.log(tempNote);

        }
      }

      retMeasures.push(tempMeasure);
    }
  }
  console.log(lines);
  console.log(retMeasures);

  // for (var l = 0; l < lines.length; l++) {
  //
  // }

  throw new Error('Could not determine "M:" field in abc');
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
