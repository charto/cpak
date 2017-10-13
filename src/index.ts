// This file is part of charto-codec, copyright (c) 2017 BusFaster Ltd.
// Released under the MIT license, see LICENSE.

export { Reader } from './Reader';
export { Writer } from './Writer';

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
