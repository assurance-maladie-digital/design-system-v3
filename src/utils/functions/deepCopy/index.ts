/** Deep copy an object or an array without reference */
export function deepCopy<T = unknown>(o: unknown): T {
	let copy: unknown = o

	if (o && typeof o === 'object') {
		if (Array.isArray(o)) {
			const arrCopy: unknown[] = []
			for (let i = 0; i < o.length; i++) {
				arrCopy[i] = deepCopy(o[i])
			}
			copy = arrCopy
		}
		else {
			const objCopy: Record<string, unknown> = {}
			for (const k of Object.keys(o)) {
				const value = (o as Record<string, unknown>)[k]
				if (value !== undefined) {
					objCopy[k] = deepCopy(value)
				}
			}
			copy = objCopy
		}
	}

	return copy as T
}
