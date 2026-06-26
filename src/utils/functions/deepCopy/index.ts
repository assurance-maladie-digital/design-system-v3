/* eslint-disable @typescript-eslint/no-explicit-any */
type UnknownValue = any

/** Deep copy an object or an array without reference */
export function deepCopy<T = any>(o: UnknownValue): T {
	let copy = o

	if (o && typeof o === 'object') {
		copy = Array.isArray(o) ? [] : {}

		for (const k of Object.keys(o)) {
			if (o[k] !== undefined) {
				copy[k] = deepCopy(o[k])
			}
		}
	}

	return copy
}
