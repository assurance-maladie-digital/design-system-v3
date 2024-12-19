type RuleOptions = {
	fieldName?: string
	message?: string
	successMessage?: string
	length?: number
	value?: number
	pattern?: RegExp
	ignoreSpace?: boolean
	fieldIdentifier?: string
	// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
	validate?: (value: any) => boolean | string
}

type ValidationResult = {
	success?: string
	error?: string
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
type ValidationRule = (value: any) => ValidationResult

export function useFieldValidation() {
	const createRule = (type: string, options: RuleOptions = {}): ValidationRule => {
		const getValueLength = (value: string) => {
			return options.ignoreSpace ? value.replace(/\s/g, '').length : value.length
		}
		// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
		return (value: any) => {
			if (type !== 'required' && typeof value === 'string' && value.trim() === '') {
				return {}
			}
			switch (type) {
				case 'required':
					return typeof value === 'string' && value.trim()
						? { success: options.successMessage || 'Le champ est valide.' }
						: { error: options.message || `Vous devez renseigner ${options.fieldName || 'ce champ'}.` }

				case 'min':
					return typeof value === 'number' && value >= (options.value ?? 0)
						? { success: options.successMessage || 'Le champ est valide.' }
						: { error: options.message || `La valeur doit être supérieure ou égale à ${options.value}.` }

				case 'minLength':
					return typeof value === 'string' && getValueLength(value) >= (options.length ?? 0)
						? { success: options.successMessage || 'Le champ est valide.' }
						: { error: options.message || `Ce champ doit avoir au moins ${options.length} caractères.` }

				case 'max':
					return typeof value === 'number' && value <= (options.value ?? Infinity)
						? { success: options.successMessage || 'Le champ est valide.' }
						: { error: options.message || `La valeur doit être inférieure ou égale à ${options.value}.` }

				case 'maxLength':
					return typeof value === 'string' && getValueLength(value) <= (options.length ?? Infinity)
						? { success: options.successMessage || 'Le champ est valide.' }
						: { error: options.message || `Ce champ ne doit pas dépasser ${options.length} caractères.` }

				case 'exactLength':
					return typeof value === 'string' && getValueLength(value) === (options.length ?? 0)
						? { success: options.successMessage || 'Le champ est valide.' }
						: { error: options.message || `Ce champ doit avoir exactement ${options.length} caractères.` }

				case 'email':
					return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
						? { success: options.successMessage || 'Le champ est valide.' }
						: { error: options.message || `Veuillez entrer un email valide.` }

				case 'matchPattern':
					return typeof value === 'string' && options.pattern?.test(value)
						? { success: options.successMessage || 'Le champ est valide.' }
						: { error: options.message || `Format invalide.` }

				case 'custom': {
					const result = options.validate?.(value)
					return result === true
						? { success: options.successMessage || 'Le champ est valide.' }
						: { error: typeof result === 'string' ? result : options.message || `Validation échouée.` }
				}

				default:
					return { error: `La règle spécifiée n'existe pas.` }
			}
		}
	}

	const generateRules = (fieldRules: Array<{ type: string, options?: RuleOptions }>) => {
		return fieldRules.map(rule => createRule(rule.type, rule.options))
	}

	return { generateRules }
}
