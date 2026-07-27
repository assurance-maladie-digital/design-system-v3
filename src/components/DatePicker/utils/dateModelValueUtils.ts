const UNSUPPORTED_VALUE = Symbol('unsupported-date-model-value')

const normalizeDateModelValue = (value: unknown) => {
	if (value === null || value === undefined) return null
	if (typeof value === 'string') return value

	if (Array.isArray(value) && value.every(item => typeof item === 'string')) {
		return value
	}

	return UNSUPPORTED_VALUE
}

export const areDateModelValuesEqual = (left: unknown, right: unknown): boolean => {
	const normalizedLeft = normalizeDateModelValue(left)
	const normalizedRight = normalizeDateModelValue(right)

	if (normalizedLeft === UNSUPPORTED_VALUE || normalizedRight === UNSUPPORTED_VALUE) {
		return false
	}

	if (Array.isArray(normalizedLeft) || Array.isArray(normalizedRight)) {
		if (!Array.isArray(normalizedLeft) || !Array.isArray(normalizedRight)) {
			return false
		}

		return normalizedLeft.length === normalizedRight.length
			&& normalizedLeft.every((value, index) => value === normalizedRight[index])
	}

	return normalizedLeft === normalizedRight
}
