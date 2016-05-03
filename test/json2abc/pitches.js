var expect = require('chai').expect;
var musicjson2abc = require('../../index.js');

it("correctly converts pitches", function() {
  var json = {
    "id": "123456",
    "attributes": {
      "divisions": 4,
      "clef": {"sign": "G", "line": 2},
      "key": {"fifths": -1},
      "time": {"beats": 3, "beat-type": 4}
    },
    "measures": []
  };
  var measure = {
    "attributes": {
      "repeat": {"left": false, "right": false}
    },
    "notes": []
  };
  var note1 = {
    "type": "16th",
    "duration": 1,
    "rest": false,
    "pitch": {"step": "C", "octave": 1, "alter": 0}
  },
  note2 = {
    "type": "16th",
    "duration": 1,
    "rest": false,
    "pitch": {"step": "D", "octave": 2, "alter": 0}
  },
  note3 = {
    "type": "16th",
    "duration": 1,
    "rest": false,
    "pitch": {"step": "E", "octave": 3, "alter": 0}
  },
  note4 = {
    "type": "16th",
    "duration": 1,
    "rest": false,
    "pitch": {"step": "F", "octave": 4, "alter": 0}
  },
  note5 = {
    "type": "16th",
    "duration": 1,
    "rest": false,
    "pitch": {"step": "G", "octave": 5, "alter": 0}
  },
  note6 = {
    "type": "16th",
    "duration": 1,
    "rest": false,
    "pitch": {"step": "A", "octave": 6, "alter": 0}
  },
  note7 = {
    "type": "16th",
    "duration": 1,
    "rest": false,
    "pitch": {"step": "B", "octave": 7, "alter": 0}
  };

  measure.notes.push(note1, note2, note3, note4, note5, note6, note7);

  json.measures.push(measure);

  var correctAbc = musicjson2abc.convert2Abc(JSON.stringify(json));
  expect(correctAbc).to.equal("X:1\nT:123456\nM:3/4\nL:1/16\nK:F\nK:treble\nC,,,1D,,1E,1F1g1a'1b''1|");
});