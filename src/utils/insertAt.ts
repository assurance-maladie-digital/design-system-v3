export function insertAt(value: string, index: number, insert: string): string {
	if (index <= 0) {
		return insert + value
	}

	if (index >= value.length) {
		return value
	}

	return value.slice(0, index) + insert + value.slice(index)
}
