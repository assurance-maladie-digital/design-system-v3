export function useMatchPatternRule() {
	const matchPattern = (pattern: RegExp, customMessage?: string) => {
		return (value: string) => {
			if (pattern.test(value)) {
				return true
			}
			return customMessage || `The value does not match the required pattern.`
		}
	}

	return {
		matchPattern,
	}
}
