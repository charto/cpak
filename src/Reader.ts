// This file is part of charto-codec, copyright (c) 2017 BusFaster Ltd.
// Released under the MIT license, see LICENSE.

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
