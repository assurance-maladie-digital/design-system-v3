export function useRequiredRules() {
	const required = (fieldName: string, customMessage?: string) => {
		return (value: string) => {
			if (value) {
				return true
			}
			return customMessage || `Vous devez renseigner ${fieldName}.`
		}
	}

	const requiredRule = (fieldName: string, customMessage?: string) => required(fieldName, customMessage)

	return {
		required,
		requiredRule,
	}
}
