var expect = require('chai').expect;
var musicjson2abc = require('../index.js');

it("correctly converts rests", function() {
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
    "rest": true,
    "pitch": {"step": "C", "octave": 5, "alter": 0}
  },
  note2 = {
    "type": "16th",
    "duration": 1,
    "rest": true,
    "pitch": {"step": "C", "octave": 5, "alter": 0},
    "dot": true
  },
  note3 = {
    "type": "eighth",
    "duration": 2,
    "rest": true,
    "pitch": {"step": "C", "octave": 5, "alter": 0}
  },
  note4 = {
    "type": "eighth",
    "duration": 2,
    "rest": true,
    "pitch": {"step": "C", "octave": 5, "alter": 0},
    "dot": true
  },
  note5 = {
    "type": "quarter",
    "duration": 4,
    "rest": true,
    "pitch": {"step": "C", "octave": 5, "alter": 0}
  },
  note6 = {
    "type": "quarter",
    "duration": 4,
    "rest": true,
    "pitch": {"step": "C", "octave": 5, "alter": 0},
    "dot": true
  },
  note7 = {
    "type": "half",
    "duration": 8,
    "rest": true,
    "pitch": {"step": "C", "octave": 5, "alter": 0}
  },
  note8 = {
    "type": "half",
    "duration": 8,
    "rest": true,
    "pitch": {"step": "C", "octave": 5, "alter": 0},
    "dot": true
  },
  note9 = {
    "type": "whole",
    "duration": 16,
    "rest": true,
    "pitch": {"step": "C", "octave": 5, "alter": 0}
  },
  note10 = {
    "type": "whole",
    "duration": 16,
    "rest": true,
    "pitch": {"step": "C", "octave": 4, "alter": 0},
    "dot": true
  };


  measure.notes.push(note1, note2, note3, note4, note5, note6, note7, note8, note9, note10);

  json.measures.push(measure);

  var correctAbc = musicjson2abc.convert2Abc(JSON.stringify(json));
  expect(correctAbc).to.equal("X:123456\nT:123456\nM:3/4\nL:1/16\nK:F\n z1 z1> z4 z2> z8 z4> z16 z8> z32 z16>|");
});