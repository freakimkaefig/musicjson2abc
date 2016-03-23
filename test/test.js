var expect 		  = require('chai').expect;
var musicjson2abc = require('../index.js');

describe('MusicJSON to abc converter', function() {
	it("converts given musicJSON to abc", function() {
		var correctAbc = musicjson2abc.convert2Abc('{"id":"123456","attributes":{"divisions":4,"clef":{"sign":"G","line":2},"key":{"fifths":-1},"time":{"beats":3,"beat-type":4}},"measures":[{"attributes":{"repeat":{"left":false,"right":false}},"notes":[{"type":"quarter","duration": 4,"rest": false,"pitch": {"step":"C","octave":4,"alter":0,"accidental": "flat"},"$$hashKey":"object:1255"}]}]}');
		expect(correctAbc).to.equal("X:123456\nT:123456\nM:3/4\nL:1/16\nK:F\n _C4|");
	});
});