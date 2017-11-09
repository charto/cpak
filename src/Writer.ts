// This file is part of charto-codec, copyright (c) 2017 BusFaster Ltd.
// Released under the MIT license, see LICENSE.

/** Variable length integer encoder. Output is an ASCII string, which never
  * gets changed by JSON.stringify (it only adds enclosing quotes). */

export class Writer {

	small(num: number) { this.data += Writer.small(num); }

	large(num: number) { this.data += Writer.large(num); }

	static small(num: number) {
		let ascii: number;
		let digit: number;
		let result = '';

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

		return(result);
	}

	static large(num: number) {
		let ascii: number;
		let digit: number;
		let result = '';

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

		return(result);
	}

	data = '';

}
