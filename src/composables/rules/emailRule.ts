export function useEmailRule() {
	const email = (fieldName: string, customMessage?: string) => {
		return (value: string) => {
			const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
			if (emailPattern.test(value)) {
				return true
			}
			return customMessage || `Vous devez renseigner un ${fieldName} valide.`
		}
	}

	return {
		email,
	}
}
