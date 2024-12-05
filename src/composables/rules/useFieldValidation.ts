type RuleOptions = {
	fieldName?: string
	message?: string
	length?: number
	value?: number
	pattern?: RegExp
	ignoreSpace?: boolean
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
type ValidationRule = (value: any) => string | boolean

export function useFieldValidation() {
	const createRule = (type: string, options: RuleOptions = {}): ValidationRule => {
		const getValueLength = (value: string) => {
			return options.ignoreSpace ? value.replace(/\s/g, '').length : value.length
		}

		switch (type) {
			case 'required':
				return (value: string) =>
					!!value || options.message || `Vous devez renseigner ${options.fieldName || 'ce champ'}.`
			case 'min':
				return (value: number) =>
					value >= (options.value ?? 0) || options.message || `La valeur doit être supérieure ou égale à ${options.value}.`
			case 'minLength':
				return (value: string) =>
					getValueLength(value) >= (options.length ?? 0) || options.message || `Ce champ doit avoir au moins ${options.length} caractères.`
			case 'max':
				return (value: number) =>
					value <= (options.value ?? Infinity) || options.message || `La valeur doit être inférieure ou égale à ${options.value}.`
			case 'maxLength':
				return (value: string) =>
					getValueLength(value) <= (options.length ?? Infinity) || options.message || `Ce champ ne doit pas dépasser ${options.length} caractères.`
			case 'exactLength':
				return (value: string) =>
					getValueLength(value) === (options.length ?? 0) || options.message || `Ce champ doit avoir exactement ${options.length} caractères.`
			case 'email':
				return (value: string) =>
					/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || options.message || `Veuillez entrer un email valide.`
			case 'matchPattern':
				return (value: string) =>
					options.pattern ? options.pattern.test(value) || options.message || `Format invalide.` : `Format invalide.`
			default:
				return () => true // Aucune règle
		}
	}
	const generateRules = (fieldRules: Array<{ type: string, options?: RuleOptions }>) => {
		return fieldRules.map(rule => createRule(rule.type, rule.options))
	}

	return { generateRules }
}
