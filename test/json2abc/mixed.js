var expect = require('chai').expect;
var musicjson2abc = require('../../index.js');

it("converts mixed musicJSON to abc", function() {
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

  measure.notes.push({
    "type": "half",
    "duration": 8,
    "rest": false,
    "pitch": {"step": "A", "octave": 3, "alter": 0, "accidental": "flat"}
  });
  measure.notes.push({
    "type": "quarter",
    "duration": 4,
    "rest": false,
    "pitch": {"step": "B", "octave": 4, "alter": 0, "accidental": "sharp"}
  });
  measure.notes.push({
    "type": "eighth",
    "duration": 3,
    "rest": false,
    "pitch": {"step": "C", "octave": 5, "alter": 0},
    "dot": true
  });
  json.measures.push(measure);

  var correctAbc = musicjson2abc.json2abc(json);
  expect(correctAbc).to.equal("X:1\nT:123456\nM:3/4\nL:1/16\nK:F\nK:treble\n_A,8^B4c2>|");
});
