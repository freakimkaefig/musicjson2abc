var expect = require('chai').expect;
var musicjson2abc = require('../../index.js');

it("correctly converts accidentals", function() {
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
      "type": "eighth",
      "duration": 1,
      "rest": false,
      "pitch": {"step": "C", "octave": 5, "alter": 0, "accidental": "flat-flat"}
    },
    note2 = {
      "type": "eighth",
      "duration": 1,
      "rest": false,
      "pitch": {"step": "C", "octave": 5, "alter": 0, "accidental": "flat"}
    },
    note3 = {
      "type": "eighth",
      "duration": 1,
      "rest": false,
      "pitch": {"step": "C", "octave": 5, "alter": 0, "accidental": "natural"}
    },
    note4 = {
      "type": "eighth",
      "duration": 1,
      "rest": false,
      "pitch": {"step": "C", "octave": 5, "alter": 0, "accidental": "sharp"}
    },
    note5 = {
      "type": "eighth",
      "duration": 1,
      "rest": false,
      "pitch": {"step": "C", "octave": 5, "alter": 0, "accidental": "sharp-sharp"}
    };


  measure.notes.push(note1, note2, note3, note4, note5);

  json.measures.push(measure);

  var correctAbc = musicjson2abc.json2abc(JSON.stringify(json));
  expect(correctAbc).to.equal("X:1\nT:123456\nM:3/4\nL:1/16\nK:F\nK:treble\n__c1_c1=c1^c1^^c1|");
});