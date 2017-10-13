// This file is part of charto-codec, copyright (c) 2017 BusFaster Ltd.
// Released under the MIT license, see LICENSE.

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
