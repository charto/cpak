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

/** Variable length integer encoder. Output is an ASCII string, which never
  * gets changed by JSON.stringify (it only adds enclosing quotes). */

export class Writer {

	static small(data: number[]) {
		let count = data.length;
		let ascii: number;
		let digit: number;
		let num: number;
		let result = '';

		while(count) {
			num = data[--count];
			digit = num % 64;
			num = (num - digit) / 64;

			ascii = digit + (((digit + 1934) * 9) >> 9);
			result = String.fromCharCode(ascii) + result;

			while(num) {
				digit = num % 28;
				num = (num - digit) / 28;

				digit += 64;
				ascii = digit + (((digit + 1934) * 9) >> 9);
				result = String.fromCharCode(ascii) + result;
			}
		}

		return(result);
	}

	static large(data: number[]) {
		let count = data.length;
		let ascii: number;
		let digit: number;
		let num: number;
		let result = '';

		while(count) {
			num = data[--count];
			digit = num % 28;
			num = (num - digit) / 28;

			digit += 64;
			ascii = digit + (((digit + 1934) * 9) >> 9);
			result = String.fromCharCode(ascii) + result;

			while(num) {
				digit = num % 64;
				num = (num - digit) / 64;

				ascii = digit + (((digit + 1934) * 9) >> 9);
				result = String.fromCharCode(ascii) + result;
			}
		}

		return(result);
	}

}

/** Variable length integer decoder. Input is an ASCII string. */

export class Reader {

	constructor(public data: string, public pos = 0) {}

	/** Read a variable length integer. Small numbers compress better.
	  * @return Decoded integer. */

	small() {
		const data = this.data;
		let pos = this.pos;
		let ascii: number;
		let digit: number;
		let num = 0;

		while((ascii = data.charCodeAt(pos++), digit = ascii - (((ascii + 1900) * 9) >> 9)) >= 64) {
			num = num * 28 + digit - 64;
		}

		this.pos = pos;

		return(num * 64 + digit);
	}

	/** Read a variable length integer. Large numbers compress better.
	  * @return Decoded integer. */

	large() {
		const data = this.data;
		let pos = this.pos;
		let ascii: number;
		let digit: number;
		let num = 0;

		while((ascii = data.charCodeAt(pos++), digit = ascii - (((ascii + 1900) * 9) >> 9)) < 64) {
			num = num * 64 + digit;
		}

		this.pos = pos;

		return(num * 28 + digit - 64);
	}

}
