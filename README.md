cpak
====

[![npm version](https://img.shields.io/npm/v/cgeo.svg)](https://www.npmjs.com/package/cgeo)

`cpak` is a geographic data format.
This package contains the spec (soon) and some supporting functions.
For reading and writing data, use (for example) [cgeo-cpak](https://github.com/charto/cgeo-cpak)

Encoding is similar to WKB (Well-Known Binary) with endianness flags omitted
and all integers stored in a variable-length format.

Integers are encoded using the 92 printable non-whitespace ASCII characters that survive
unchanged through `JSON.stringify`. These form 2 groups containing 64 and 28 characters.

Every number ends with a character from one of the groups and if that is not sufficient
to encode the number, it's preceded by characters from the other group.

Numbers expected to be smaller than 64 use the 64-character group for their last "digit".
That allows usually storing them in one byte. Larger numbers use the 28-character group
for their last "digit" and 64-character group for the other digits. That allows usually
storing them in the same space that Base64 would take.

License
=======

[The MIT License](https://raw.githubusercontent.com/charto/cpak/master/LICENSE)

Copyright (c) 2017 BusFaster Ltd
