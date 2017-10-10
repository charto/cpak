// This file is part of charto-codec, copyright (c) 2017 BusFaster Ltd.
// Released under the MIT license, see LICENSE.

/** Zigzag encode signed integer as unsigned,
  * with sign in the least significant bit.
  * In Out
  * -2  3
  * -1  1
  *  0  0
  *  1  2
  *  2  4 */

export function encodeSign(x: number) {
	return((x << 1) ^ (x >> 31));
}

/** Zigzag decode integer, extracting sign
  * from the least significant bit.
  * In Out
  *  0  0
  *  1 -1
  *  2  1
  *  3 -2
  *  4  2 */

export function decodeSign(x: number) {
	return((x >>> 1) ^ -(x & 1));
}

// Codec alphabet is all printable ASCII supported in JSON strings without escaping.
// Space character is removed to avoid trailing spaces getting truncated somewhere.
//                         1         2         3         4         5         6         7         8         9
//                12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012
const alphabet = "!#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_`abcdefghijklmnopqrstuvwxyz{|}~";
const encodeTbl: number[] = [];
const decodeTbl: number[] = [];

for(let pos = 0; pos < alphabet.length; ++pos) {
	const code = alphabet.charCodeAt(pos);
	encodeTbl[pos] = code;
	decodeTbl[code] = pos;
}

const extra = alphabet.length - 64;

/** Variable length integer encoder. Output is an ASCII string, which never
  * gets changed by JSON.stringify (it only adds enclosing quotes). */

export class Writer {

	static small(data: number[]) {
		let count = data.length;
		let code: number;
		let num: number;
		let result = '';

		while(count) {
			num = data[--count];
			result = encodeTbl[num & 63] + result;
			num >>= 6;

			while(num) {
				code = num % extra;
				num = (num - code) / extra;
				result = encodeTbl[code + 64] + result;
			}
		}

		return(result);
	}

	static large(data: number[]) {
		let count = data.length;
		let code: number;
		let num: number;
		let result = '';

		while(count) {
			num = data[--count];
			code = num % extra;
			num = (num - code) / extra;
			result = encodeTbl[code + 64] + result;

			while(num) {
				result = encodeTbl[num & 63] + result;
				num >>= 6;
			}
		}

		return(result);
	}

}

/** Variable length integer decoder. Input is an ASCII string. */

export class Reader {

	constructor(public data: string, pos = 0, len = data.length) {
		this.pos = pos - 1;
		this.len = len - 1;
	}

	/** Read a sequence of variable length integers. Small numbers compress better.
	  * @param result Output array, reusable between calls for speed.
	  * @param count Number of values to decode. */

	small(result: number[], count: number) {
		const data = this.data;
		const len = this.len;
		let pos = this.pos;
		let posOut = -1;
		let code: number;
		let num: number;

		while(pos < len && posOut < count) {
			num = 0;

			while((code = decodeTbl[data.charCodeAt(++pos)]) >= 64) {
				num = num * extra + code - 64;
			}

			result[++posOut] = (num << 6) + code;
		}

		this.pos = pos;

		return(posOut);
	}

	large(result: number[], count: number) {
		const data = this.data;
		const len = this.len;
		let pos = this.pos;
		let posOut = -1;
		let code: number;
		let num: number;

		while(pos < len && posOut < count) {
			num = 0;

			while((code = decodeTbl[data.charCodeAt(++pos)]) < 64) {
				num = (num << 6) + code;
			}

			result[++posOut] = num * extra + code - 64;
		}

		this.pos = pos;

		return(posOut);
	}

	pos: number;
	len: number;

}
