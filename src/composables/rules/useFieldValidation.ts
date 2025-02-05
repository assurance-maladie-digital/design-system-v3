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
				if (options.isWarning) {
					// Pour un warning, on retourne un succès si la validation est réussie
					return isValid 
						? { success: baseMessages.success }
						: { warning: message || baseMessages.warning }
				}
				// Pour une erreur, on retourne un succès si la validation est réussie
				return isValid 
					? { success: baseMessages.success }
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
					const dayOfWeek = dateValue.getDay()
					const isValid = dayOfWeek !== 0 && dayOfWeek !== 6 // 0 = Dimanche, 6 = Samedi
					const message = options.isWarning
						? options.warningMessage
						: options.message || `${identifier} ne doit pas être un weekend.`

					return createValidationResult(isValid, message)
				}

				case 'notBeforeToday': {
					const today = new Date()
					today.setHours(0, 0, 0, 0)
					const dateValue = new Date(value)
					dateValue.setHours(0, 0, 0, 0)

					const isValid = dateValue >= today
					const message = options.isWarning
						? options.warningMessage
						: options.message || `${identifier} ne peut pas être avant aujourd'hui.`

					return createValidationResult(isValid, message)
				}

				case 'notAfterToday': {
					const today = new Date()
					today.setHours(0, 0, 0, 0)
					const dateValue = new Date(value)
					dateValue.setHours(0, 0, 0, 0)

					const isValid = dateValue <= today
					const message = options.isWarning
						? options.warningMessage
						: options.message || `${identifier} ne peut pas être après aujourd'hui.`

					return createValidationResult(isValid, message)
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

					// Pour un warning, on veut l'afficher quand la date est avant la référence
					const isValid = dateValue >= referenceDate
					const message = options.isWarning
						? options.warningMessage
						: options.message || `${identifier} ne peut pas être avant le ${options.date}.`

					return createValidationResult(isValid, message)
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

					const isValid = dateValue <= referenceDate
					const message = options.isWarning
						? options.warningMessage
						: options.message || `${identifier} ne peut pas être après le ${options.date}.`

					return createValidationResult(isValid, message)
				}

				case 'dateExact': {
					if (!options.date) {
						return { error: 'Configuration de la règle invalide' }
					}

					const dateValue = new Date(value)

					if (typeof options.date !== 'string') {
						throw new Error('Date reference must be a string in DD/MM/YYYY format')
					}

					const [day, month, year] = options.date.split('/')
					const referenceDate = new Date(`${year}-${month}-${day}`)

					const isValid = dateValue.getTime() === referenceDate.getTime()
					const message = options.isWarning
						? options.warningMessage
						: options.message || `${identifier} doit être exactement le ${options.date}.`

					return createValidationResult(isValid, message)
				}

				case 'dateFormat': {
					if (!value) return {}
					if (typeof value !== 'string') return createValidationResult(false, options.message || `${identifier} doit être une chaîne de caractères`)

					// Si la saisie est incomplète, on ne valide pas
					if (value.length < 10) return {}

					const parts = value.split('/')
					if (parts.length !== 3) {
						return createValidationResult(false, options.message || `${identifier} doit respecter le format JJ/MM/AAAA`)
					}

					const [day, month, year] = parts.map(p => parseInt(p))

					if (isNaN(day) || isNaN(month) || isNaN(year)) {
						return createValidationResult(false, options.message || `${identifier} doit contenir uniquement des chiffres`)
					}

					if (day < 1 || day > 31) {
						return createValidationResult(false, options.message || `Le jour doit être entre 1 et 31`)
					}

					if (month < 1 || month > 12) {
						return createValidationResult(false, options.message || `Le mois doit être entre 1 et 12`)
					}

					if (year < 1900 || year > 2100) {
						return createValidationResult(false, options.message || `L'année doit être entre 1900 et 2100`)
					}

					const date = new Date(year, month - 1, day)
					if (date.getDate() !== day || date.getMonth() !== month - 1 || date.getFullYear() !== year) {
						return createValidationResult(false, options.message || `La date n'est pas valide`)
					}

					return createValidationResult(true)
				}

				case 'dateRange': {
					if (!value) return {}
					if (typeof value !== 'string') return createValidationResult(false, options.message || `${identifier} doit être une chaîne de caractères`)

					// Si la saisie est incomplète, on ne valide pas
					if (!value.includes(' - ')) return {}

					const [start, end] = value.split(' - ')
					if (!start || !end) return {}

					// Valider chaque date individuellement
					const startValidation = createRule('dateFormat', options)(start)
					const endValidation = createRule('dateFormat', options)(end)

					if (!startValidation.success) return startValidation
					if (!endValidation.success) return endValidation

					// Vérifier que la date de fin est après la date de début
					const [startDay, startMonth, startYear] = start.split('/').map(Number)
					const [endDay, endMonth, endYear] = end.split('/').map(Number)
					const startDate = new Date(startYear, startMonth - 1, startDay)
					const endDate = new Date(endYear, endMonth - 1, endDay)

					if (endDate < startDate) {
						return createValidationResult(false, options.message || `La date de fin doit être après la date de début`)
					}

					return createValidationResult(true)
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
