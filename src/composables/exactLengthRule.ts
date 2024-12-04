// src/composables/exactLengthRule.ts
export function useExactLengthRule() {
	const exactLength = (length: number, customMessage?: string, ignoreSpaces: boolean = false) => {
		return (value: string) => {
			const valueToCheck = ignoreSpaces ? value.replace(/\s/g, '') : value
			if (valueToCheck.length === length) {
				return true
			}
			return customMessage || `exactLength`
		}
	}

	return {
		exactLength,
	}
}
