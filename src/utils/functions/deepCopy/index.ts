/* eslint-disable @typescript-eslint/no-explicit-any */
import { toRaw } from 'vue'

type UnknownValue = any

/** Deep copy an object or an array without reference */
export function deepCopy<T = any>(o: UnknownValue): T {
	const value = toRaw(o)
	let copy = o
	let k

	if (value && typeof value === 'object') {
		copy = Object.prototype.toString.call(value) === '[object Array]' ? [] : {}

		for (k in value) {
			if (value[k] !== undefined) {
				copy[k] = deepCopy(value[k])
			}
		}
	}

	return copy
}
