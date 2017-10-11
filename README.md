cpak
====

[![npm version](https://img.shields.io/npm/v/cpak.svg)](https://www.npmjs.com/package/cpak)

`cpak` is a compressed data format for numeric data, embeddable in code and
text documents. It's especially suitable for geometry and geographic data.

This package contains the spec (soon) and some supporting functions.
For reading and writing geographic data, use (for example)
[cgeo-cpak](https://github.com/charto/cgeo-cpak)

The specification consists of multiple levels:

- Level 0: Suitable for any numeric data. Necessary JavaScript code (and no more)
  is included in this package.
- Level 1: Defines an encoding for SQL/MM Spatial data types. Additional convention or
  configuration is required to represent WKB and WKT data.
- Level 2 (future): Full replacement for WKB and WKT.

Level 0
-------

Unsigned integers are encoded using the 92 printable non-whitespace ASCII
characters that survive unchanged through `JSON.stringify`. These form 2 groups
containing 64 and 28 characters, used as "digits" in base 64 or 28.

Signed integers are zigzag encoded first, in the same way as protocol buffers:

```TypeScript
unsigned = (signed << 1) ^ (signed >> 31);
signed = (unsigned >>> 1) ^ -(unsigned & 1);
```

Digits are stored most significant first, and the last digit always comes from
a different group than any preceding ones, to distinguish where the next number
begins.

Numbers expected to be smaller than 64 use the 64-character group for their
last "digit". That allows usually storing them in one byte. Larger numbers use
the 28-character group for their last "digit" and 64-character group for the
other digits. That allows usually storing them in the same amount of space that
Base64 would take.

Characters left unused due to incompatibility with JSON are `"` and `\` (ASCII
34 and 92). It turns out the following formulas convert between digits and
ASCII characters without requiring lookup tables:

```TypeScript
ascii = digit + (((digit + 1934) * 9) >> 9);
digit = ascii - (((ascii + 1900) * 9) >> 9);
```

The same code works at least in JavaScript, C and C++. All those languages also
support string literals with `cpak` encoded data as-is.

`digit` is a number between 0-91, where 0-63 forms one group and 64-91 is the
other. `ascii` is a character code from the following string, indexed by `digit`:

```text
!#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_`abcdefghijklmnopqrstuvwxyz{|}~
```

Level 1
-------

Encoding is similar to WKB (Well-Known Binary) with endianness flags omitted
and all integers stored in a variable-length format.

License
=======

Dual-licensed under:

[The MIT License](https://raw.githubusercontent.com/charto/cpak/master/LICENSE)

[![CC0](http://i.creativecommons.org/p/zero/1.0/88x31.png)](http://creativecommons.org/publicdomain/zero/1.0/)

Copyright (c) 2017 BusFaster Ltd
