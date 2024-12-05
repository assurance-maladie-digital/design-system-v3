export function useMinLengthRule() {
	const minLength = (length: number, customMessage?: string, ignoreSpaces: boolean = false) => {
		return (value: string) => {
			const valueToCheck = ignoreSpaces ? value.replace(/\s/g, '') : value
			if (valueToCheck.length >= length) {
				return true
			}
			return customMessage || `The minimum length is ${length} characters.`
		}
	}

	return {
		minLength,
	}
}
