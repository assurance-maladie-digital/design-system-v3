import { useHolidayDay } from '@/composables/date/useHolidayDay'
// Regular expressions
export const EMAIL_REGEXP = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

// Import du composable pour les jours fériés

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

	// Fonction pour parser une date selon le format spécifié
	const parseDate = (dateStr: string | Date, format: string = 'DD/MM/YYYY'): Date | null => {
		if (!dateStr) return null

		// If dateStr is already a Date object, return it
		if (dateStr instanceof Date) {
			return dateStr
		}

		const parts = dateStr.split(/[-/.]/)
		const formatParts = format.split(/[-/.]/)

		if (parts.length !== formatParts.length) {
			return null
		}

		let day = 1, month = 0, year = 1970

		// Mapper les parties selon le format
		for (let i = 0; i < formatParts.length; i++) {
			const value = parseInt(parts[i], 10)
			if (isNaN(value)) {
				return null
			}

			switch (formatParts[i].toUpperCase()) {
				case 'DD':
					day = value
					break
				case 'MM':
					month = value - 1 // JavaScript months are 0-based
					break
				case 'YY':
					year = value + 2000 // Assuming 20xx for YY format
					break
				case 'YYYY':
					year = value
					break
			}
		}

		// Valider les limites
		if (month < 0 || month > 11) return null
		if (day < 1 || day > 31) return null
		if (year < 1900 || year > 2100) return null

		const date = new Date(year, month, day)

		// Vérifier si la date est valide (ex: 31/04 n'existe pas)
		if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
			return null
		}

		return date
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
				error: options.message || `Validation pour ${identifier}.`,
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
						(typeof value === 'string' && value.trim() !== '')
						|| (value instanceof Date)
						|| (typeof value === 'object' && value !== null),
						options.message || options.warningMessage || `Vous devez renseigner ${identifier}.`,
					)

				case 'min':
					return createValidationResult(
						typeof value === 'number' && value >= (options.value ?? 0),
						options.message || options.warningMessage || `La valeur de ${identifier} doit être supérieure ou égale à ${options.value}.`,
					)

				case 'max':
					return createValidationResult(
						typeof value === 'number' && value <= (options.value ?? Infinity),
						options.message || options.warningMessage || `La valeur de ${identifier} doit être inférieure ou égale à ${options.value}.`,
					)

				case 'minLength':
					return createValidationResult(
						typeof value === 'string' && getValueLength(value, options.ignoreSpace) >= (options.length ?? 0),
						options.message || options.warningMessage || `${identifier} doit contenir au moins ${options.length} caractères.`,
					)

				case 'maxLength':
					return createValidationResult(
						typeof value === 'string' && getValueLength(value, options.ignoreSpace) <= (options.length ?? Infinity),
						options.message || options.warningMessage || `${identifier} ne doit pas dépasser ${options.length} caractères.`,
					)

				case 'exactLength':
					return createValidationResult(
						typeof value === 'string' && getValueLength(value, options.ignoreSpace) === (options.length ?? 0),
						options.message || options.warningMessage || `${identifier} doit contenir exactement ${options.length} caractères.`,
					)

				case 'email':
					return createValidationResult(
						typeof value === 'string' && EMAIL_REGEXP.test(value),
						options.message || options.warningMessage || `${identifier} doit être un email valide.`,
					)

				case 'matchPattern':
					return createValidationResult(
						typeof value === 'string' && !!options.pattern && options.pattern.test(value),
						options.message || options.warningMessage || `Le format de ${identifier} est invalide.`,
					)

				case 'notWeekend': {
					if (value === null || value === undefined || value === '') {
						return {}
					}

					const dateValue = parseDate(value)
					if (!dateValue) {
						return { error: 'Date invalide' }
					}

					return createValidationResult(
						!(dateValue.getDay() === 0 || dateValue.getDay() === 6),
						options.message || options.warningMessage || `${identifier} ne peut pas être un jour de weekend.`,
					)
				}

				case 'notBeforeToday': {
					if (value === null || value === undefined || value === '') {
						return {}
					}

					const dateValue = parseDate(value)
					if (!dateValue) {
						return { error: 'Date invalide' }
					}

					// Réinitialiser l'heure à minuit pour ne comparer que les dates
					dateValue.setHours(0, 0, 0, 0)

					// Créer une date aujourd'hui à minuit pour comparaison
					const today = new Date()
					today.setHours(0, 0, 0, 0)

					return createValidationResult(
						dateValue >= today,
						options.message || options.warningMessage || `${identifier} ne peut pas être antérieur à aujourd'hui.`,
					)
				}

				case 'notAfterToday': {
					if (value === null || value === undefined || value === '') {
						return {}
					}

					const dateValue = parseDate(value)
					if (!dateValue) {
						return { error: 'Date invalide' }
					}

					// Réinitialiser l'heure à minuit pour ne comparer que les dates
					dateValue.setHours(0, 0, 0, 0)

					// Créer une date aujourd'hui à minuit pour comparaison
					const today = new Date()
					today.setHours(0, 0, 0, 0)

					return createValidationResult(
						dateValue <= today,
						options.message || options.warningMessage || `${identifier} ne peut pas être postérieur à aujourd'hui.`,
					)
				}

				case 'notBeforeDate': {
					if (typeof options.date === 'undefined') {
						return { error: 'Configuration de la règle invalide' }
					}
					// Si la valeur est null ou vide, ne pas valider (champ vide autorisé)
					if (value === null || value === undefined || value === '') {
						return {}
					}
					if (options.date === null || (typeof options.date === 'string' && options.date.trim() === '')) {
						return {}
					}
					const dateValue = parseDate(value)
					if (!dateValue) {
						return { error: 'Date invalide' }
					}

					// Check if options.date is a string and in DD/MM/YYYY format
					if (typeof options.date !== 'string') {
						throw new Error('Date reference must be a string in DD/MM/YYYY format')
					}

					const referenceDate = parseDate(options.date)
					if (!referenceDate) {
						return { error: 'Date de référence invalide' }
					}

					// Normaliser les dates en réinitialisant les heures/minutes/secondes
					dateValue.setHours(0, 0, 0, 0)
					referenceDate.setHours(0, 0, 0, 0)

					return createValidationResult(
						dateValue >= referenceDate,
						options.message || options.warningMessage || `${identifier} ne peut pas être avant le ${options.date}.`,
					)
				}

				case 'notAfterDate': {
					if (typeof options.date === 'undefined') {
						return { error: 'Configuration de la règle invalide' }
					}
					// Si la valeur est null ou vide, ne pas valider (champ vide autorisé)
					if (value === null || value === undefined || value === '') {
						return {}
					}
					if (options.date === null || (typeof options.date === 'string' && options.date.trim() === '')) {
						return {}
					}
					const dateValue = parseDate(value)
					if (!dateValue) {
						return { error: 'Date invalide' }
					}

					// Check if options.date is a string and in DD/MM/YYYY format
					if (typeof options.date !== 'string') {
						throw new Error('Date reference must be a string in DD/MM/YYYY format')
					}

					const referenceDate = parseDate(options.date)
					if (!referenceDate) {
						return { error: 'Date de référence invalide' }
					}

					// Normaliser les dates en réinitialisant les heures/minutes/secondes
					dateValue.setHours(0, 0, 0, 0)
					referenceDate.setHours(0, 0, 0, 0)

					return createValidationResult(
						dateValue <= referenceDate,
						options.message || options.warningMessage || `${identifier} ne peut pas être après le ${options.date}.`,
					)
				}

				case 'dateExact': {
					if (typeof options.date === 'undefined') {
						return { error: 'Configuration de la règle invalide' }
					}
					// Si la valeur est null ou vide, ne pas valider (champ vide autorisé)
					if (value === null || value === undefined || value === '') {
						return {}
					}
					if (options.date === null || (typeof options.date === 'string' && options.date.trim() === '')) {
						return {}
					}
					const dateValue = parseDate(value)
					if (!dateValue) {
						return { error: 'Date invalide' }
					}

					if (typeof options.date !== 'string') {
						throw new Error('Date reference must be a string in DD/MM/YYYY format')
					}

					const referenceDate = parseDate(options.date)
					if (!referenceDate) {
						return { error: 'Date de référence invalide' }
					}

					// Normaliser les deux dates en réinitialisant les heures/minutes/secondes
					dateValue.setHours(0, 0, 0, 0)
					referenceDate.setHours(0, 0, 0, 0)

					// Comparer les dates normalisées
					const isSameDate = dateValue.getFullYear() === referenceDate.getFullYear()
						&& dateValue.getMonth() === referenceDate.getMonth()
						&& dateValue.getDate() === referenceDate.getDate()

					return createValidationResult(
						isSameDate,
						options.message || options.warningMessage || `${identifier} doit être exactement le ${options.date}.`,
					)
				}

				case 'isHolidayDay': {
					const { isHolidayDay } = useHolidayDay()
					if (value === null || value === undefined || value === '') {
						return {}
					}

					const dateValue = parseDate(value)
					if (!dateValue) {
						return { error: 'Date invalide' }
					}

					return createValidationResult(
						!isHolidayDay(dateValue),
						options.message || options.warningMessage || `${identifier} est un jour férié.`,
					)
				}

				case 'custom': {
					const result = options.validate?.(value)
					if (result === true) {
						return { success: options.successMessage || baseMessages.success }
					}
					return options.isWarning
						? { warning: typeof result === 'string' ? result : options.warningMessage || baseMessages.warning }
						: { error: typeof result === 'string' ? result : options.message || baseMessages.error }
				}

				default:
					return { error: `La règle spécifiée pour ${identifier} n'existe pas.` }
			}
		}
	}

	const generateRules = (fieldRules: Array<{ type: string, options?: RuleOptions }>): ValidationRule[] => {
		return fieldRules.map(rule => createRule(rule.type, rule.options))
	}

	return {
		generateRules,
		parseDate,
	}
}
