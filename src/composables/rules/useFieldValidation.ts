export type ValidationResult = {
	success?: string
	error?: string
	warning?: string
}

export type RuleOptions = {
	message?: string
	successMessage?: string
	warningMessage?: string
	fieldName?: string
	fieldIdentifier?: string
	// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
	value?: any
	length?: number
	pattern?: RegExp
	ignoreSpace?: boolean
	isWarning?: boolean // Si true, la règle génère un warning au lieu d'une erreur
	// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
	validate?: (value: any) => boolean | string
	date?: string | Date // Date de référence pour les règles notBeforeDate et notAfterDate
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
export type ValidationRule = (value: any) => ValidationResult

export function useFieldValidation() {
	const getValueLength = (value: string, ignoreSpace?: boolean): number => {
		return ignoreSpace ? value.replace(/\s/g, '').length : value.length
	}

	const createRule = (type: string, options: RuleOptions = {}): ValidationRule => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
		return (value: any): ValidationResult => {
			// Gestion des champs vides non obligatoires
			if (type !== 'required' && typeof value === 'string' && value.trim() === '') {
				return {}
			}

			// Identifier de champ pour personnaliser les messages
			const identifier = options.fieldIdentifier
				? `${options.fieldIdentifier}`
				: options.fieldName || 'ce champ'

			const baseMessages = {
				success: options.successMessage || 'Le champ est valide.',
				error: options.message || `Validation échouée pour ${identifier}.`,
				warning: options.warningMessage || `Attention : ${identifier} peut contenir une erreur.`,
			}

			const createValidationResult = (isValid: boolean, message?: string): ValidationResult => {
				if (isValid) {
					return { success: baseMessages.success }
				}
				return options.isWarning
					? { warning: message || baseMessages.warning }
					: { error: message || baseMessages.error }
			}

			switch (type) {
				case 'required':
					return createValidationResult(
						typeof value === 'string' && value.trim() !== '',
						options.message || `Vous devez renseigner ${identifier}.`,
					)

				case 'min':
					return createValidationResult(
						typeof value === 'number' && value >= (options.value ?? 0),
						options.message || `La valeur de ${identifier} doit être supérieure ou égale à ${options.value}.`,
					)

				case 'max':
					return createValidationResult(
						typeof value === 'number' && value <= (options.value ?? Infinity),
						options.message || `La valeur de ${identifier} doit être inférieure ou égale à ${options.value}.`,
					)

				case 'minLength':
					return createValidationResult(
						typeof value === 'string' && getValueLength(value, options.ignoreSpace) >= (options.length ?? 0),
						options.message || `${identifier} doit contenir au moins ${options.length} caractères.`,
					)

				case 'maxLength':
					return createValidationResult(
						typeof value === 'string' && getValueLength(value, options.ignoreSpace) <= (options.length ?? Infinity),
						options.message || `${identifier} ne doit pas dépasser ${options.length} caractères.`,
					)

				case 'exactLength':
					return createValidationResult(
						typeof value === 'string' && getValueLength(value, options.ignoreSpace) === (options.length ?? 0),
						options.message || `${identifier} doit contenir exactement ${options.length} caractères.`,
					)

				case 'email':
					return createValidationResult(
						typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
						options.message || `${identifier} doit être un email valide.`,
					)

				case 'matchPattern':
					return createValidationResult(
						typeof value === 'string' && !!options.pattern && options.pattern.test(value),
						options.message || `Le format de ${identifier} est invalide.`,
					)

				case 'notWeekend': {
					const dateValue = new Date(value)
					return createValidationResult(
						!(dateValue.getDay() === 0 || dateValue.getDay() === 6),
						options.message || `${identifier} ne peut pas être un jour de weekend.`,
					)
				}

				case 'notBeforeToday': {
					const dateValue = new Date(value)
					return createValidationResult(
						dateValue >= new Date(),
						options.message || `${identifier} ne peut pas être antérieur à aujourd'hui.`,
					)
				}

				case 'notAfterToday': {
					const dateValue = new Date(value)
					return createValidationResult(
						dateValue <= new Date(),
						options.message || `${identifier} ne peut pas être postérieur à aujourd'hui.`,
					)
				}

				case 'notBeforeDate': {
					if (!options.date) {
						return { error: 'Configuration de la règle invalide' }
					}

					const dateValue = new Date(value)

					// Check if options.date is a string and in DD/MM/YYYY format
					if (typeof options.date !== 'string') {
						throw new Error('Date reference must be a string in DD/MM/YYYY format')
					}

					// Convert reference date from DD/MM/YYYY format to YYYY-MM-DD
					const [day, month, year] = options.date.split('/')
					const referenceDate = new Date(`${year}-${month}-${day}`)

					return createValidationResult(
						dateValue >= referenceDate,
						options.message || `${identifier} ne peut pas être avant le ${options.date}.`,
					)
				}

				case 'notAfterDate': {
					if (!options.date) {
						return { error: 'Configuration de la règle invalide' }
					}

					const dateValue = new Date(value)

					// Check if options.date is a string and in DD/MM/YYYY format
					if (typeof options.date !== 'string') {
						throw new Error('Date reference must be a string in DD/MM/YYYY format')
					}

					// Convert reference date from DD/MM/YYYY format to YYYY-MM-DD
					const [day, month, year] = options.date.split('/')
					const referenceDate = new Date(`${year}-${month}-${day}`)

					return createValidationResult(
						dateValue <= referenceDate,
						options.message || `${identifier} ne peut pas être après le ${options.date}.`,
					)
				}

				case 'custom': {
					const result = options.validate?.(value)
					if (result === true) {
						return { success: baseMessages.success }
					}
					return options.isWarning
						? { warning: typeof result === 'string' ? result : baseMessages.warning }
						: { error: typeof result === 'string' ? result : baseMessages.error }
				}

				default:
					return { error: `La règle spécifiée pour ${identifier} n'existe pas.` }
			}
		}
	}

	const generateRules = (fieldRules: Array<{ type: string, options?: RuleOptions }>): ValidationRule[] => {
		return fieldRules.map(rule => createRule(rule.type, rule.options))
	}

	return { generateRules }
}
