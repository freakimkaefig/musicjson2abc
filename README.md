# musicjson2abc
A command-line tool to convert musicJSON to abc notation
An example of the used format of json is in [example.json](https://github.com/freakimkaefig/musicjson2abc/blob/master/example.json).

## Getting started
Install the module with:
```
npm install -g musicjson2abc
```

## Command line tool
The command `musicjson2abc` accepts filepaths for input and output files.
```
$ musicjson2abc --help

  Usage: musicjson2abc [options] <input> [output]

  Options:

    -h, --help     output usage information
    -V, --version  output the version number

  Examples:

    $ musicjson2abc input.json output.abc
    $ musicjson2abc example.json example.abc

  Hint:

    The input file should be a valid musicJSON file
    The output file will become a valid abc file. May overwrite existing files.
```

## License
Licensed under the MIT License. See [LICENSE](https://github.com/freakimkaefig/musicjson2abc/blob/master/LICENSE) for further information.
