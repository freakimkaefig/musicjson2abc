# musicjson2abc

[![Build Status](https://travis-ci.org/freakimkaefig/musicjson2abc.svg?branch=master)](https://travis-ci.org/freakimkaefig/musicjson2abc)
[![npm version](https://badge.fury.io/js/musicjson2abc.svg)](https://badge.fury.io/js/musicjson2abc)

A command-line tool to convert musicJSON to abc notation
An example of the used format of json is in [example.json](https://github.com/freakimkaefig/musicjson2abc/blob/master/example.json).

This project is still under development. Feel free to use it and submit issues here.

## Getting started
Install the module with:
```sh
npm install -g musicjson2abc
```

## Example
```javascript
var musicjson2abc = require('musicjson2abc');

var abc = musicjson2abc.convert2Abc('{"id":"123456","attributes":{"divisions":4,"clef":{"sign":"G","line":2},"key":{"fifths":-1},"time":{"beats":3,"beat-type":4}},"measures":[{"attributes":{"repeat":{"left":false,"right":false}},"notes":[{"type":"quarter","duration": 4,"rest": false,"pitch": {"step":"C","octave":4,"alter":0,"accidental": "flat"},"$$hashKey":"object:1255"}]}]}');

console.log(abc);
// output:
//   X:123456
//   T:123456
//   M:3/4
//   L:1/16
//   K:F
//    _C4|


var json = musicjson2abc.convert2JSON(abc);
console.log(json);
// output:
// {"id":"123456","attributes":{"divisions":4,"clef":{"sign":"G","line":2},"key":{"fifths":-1},"time":{"beats":3,"beat-type":4}},"measures":[{"attributes":{"repeat":{"left":false,"right":false}},"notes":[{"type":"quarter","duration": 4,"rest": false,"pitch": {"step":"C","octave":4,"alter":0,"accidental": "flat"}}]}]}

```

## Command line tool
The command `musicjson2abc` accepts filepaths for input and output files.
```
$ musicjson2abc --help

  Usage: musicjson2abc [options] <input> [output]

  Options:

    -h, --help     output usage information
    -r, --reverse  convert abc to json instead
    -d, --debug    outputs debug information on stdout
    -V, --version  output the version number

  Examples:

    $ musicjson2abc input.json output.abc
    $ musicjson2abc input.json output.abc -d
    $ musicjson2abc example.abc example.json -r

  Hint:

    The input file should be a valid json / abc file.
    No syntax checks performed.
    The output file will become a valid abc / json file.
    May overwrite existing files.
```

## License
Licensed under the MIT License. See [LICENSE](https://github.com/freakimkaefig/musicjson2abc/blob/master/LICENSE) for further information.
