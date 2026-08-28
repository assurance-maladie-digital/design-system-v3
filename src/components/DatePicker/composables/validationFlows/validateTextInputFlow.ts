import { unref } from 'vue'
import type { ValidationRule } from '@/composables/unifyValidation/useValidation'
import { locales } from '../../locales'
import type { DatePickerRule } from '../../types'
import { adaptCustomRules, validateEmptyOrIncompleteDate } from '../../utils/validationUtils'
import { getRangeValidationError } from '../../utils/dateFormattingUtils'
import { validateDateFormat, isDateComplete } from '../useDateFormatUtils'
import type { ValidationContext } from './types'

/**
 * Flow 3 : validateTextInput — validation de saisie texte (noCalendar / DateTextInput).
 *
 * Trois cas :
 * 1. Mode Vuetify natif → déléguer à useCustomValidation
 * 2. Valeur vide → valider required + custom rules sur null (champ vide)
 * 3. Plage de dates (avec séparateur) → valider start et end séparément, fusionner
 * 4. Date unique → validateSingleTextInput
 */

/**
 * Crée le flow validateTextInput et les helpers associés.
 *
 * @param ctx Le contexte de validation partagé
 * @returns `{ validateTextInput }`
 */
export function createValidateTextInputFlow(ctx: ValidationContext) {
	const { options } = ctx

	/**
	 * Filtre les custom rules pour ne garder que celles qui sont "prêtes".
	 * Une règle notBeforeDate/notAfterDate/exactDate est "prête" si son options.date est défini.
	 * Si aucune règle n'est prête alors qu'il y en a, retourne null pour skip la validation
	 * (évite l'erreur "Configuration de la règle invalide" quand les computed réactifs
	 * ne sont pas encore mis à jour, ex: dateA pas encore sélectionnée pour dateBRules).
	 */
	const getReadyCustomRules = (): DatePickerRule[] | null => {
		const currentCustomRules = options.customRules.value
		const readyRules = currentCustomRules.filter((rule) => {
			if (rule.type === 'notBeforeDate' || rule.type === 'notAfterDate' || rule.type === 'exactDate') {
				return rule.options && rule.options.date !== undefined
			}
			return true
		})
		if (readyRules.length === 0 && currentCustomRules.length > 0) {
			return null
		}
		return readyRules
	}

	/**
	 * Adapte les règles DatePicker (custom, warning, success) au format ValidationRule[]
	 * en utilisant le format d'affichage courant.
	 */
	const getAdaptedRules = (
		customRules: DatePickerRule[],
		warningRules: DatePickerRule[],
		successRules: DatePickerRule[],
	): { customRules: ValidationRule[], warningRules: ValidationRule[], successRules: ValidationRule[] } => {
		const format = unref(options.displayFormat) ?? ''
		return {
			customRules: adaptCustomRules(customRules, format) as ValidationRule[],
			warningRules: adaptCustomRules(warningRules, format) as ValidationRule[],
			successRules: adaptCustomRules(successRules, format) as ValidationRule[],
		}
	}

	/**
	 * Valide une date (objet Date) avec les custom rules filtrées et adaptées.
	 * Retourne true si valide, false si erreur.
	 * Si shouldDisplayErrors est false, retourne juste l'état sans afficher.
	 */
	const validateCustomRulesForDate = (date: Date): boolean | Promise<boolean> => {
		if (ctx.shouldDisplayErrors() === false) {
			return !ctx.displayHasError.value
		}
		const readyRules = getReadyCustomRules()
		if (readyRules === null) {
			return true
		}
		const adapted = getAdaptedRules(readyRules, options.customWarningRules.value, options.customSuccessRules?.value ?? [])
		const result = ctx.validateField(date, adapted.customRules, adapted.warningRules, adapted.successRules)

		if (result instanceof Promise) {
			return result.then(resolvedResult => !resolvedResult.hasError)
		}
		return !result.hasError
	}

	/**
	 * Valide une saisie texte correspondant à une date unique.
	 *
	 * Étapes :
	 * 1. Vérifie si la valeur est vide ou incomplète (validateEmptyOrIncompleteDate)
	 * 2. Valide le format (validateDateFormat)
	 * 3. Parse la date avec parseDate
	 * 4. Valide la date parsée avec les custom rules (validateCustomRulesForDate)
	 */
	const validateSingleTextInput = async (value: string): Promise<boolean> => {
		const format = unref(options.displayFormat) ?? ''

		// 1. Vérifier si vide ou incomplet
		const emptyCheck = validateEmptyOrIncompleteDate(
			value,
			unref(options.required),
			(dateValue: string) => isDateComplete(dateValue, format),
			options.hasInteracted?.value ?? false,
		)

		if (!emptyCheck.isValid && emptyCheck.errorMessage && ctx.shouldDisplayErrors()) {
			ctx.pushError(emptyCheck.errorMessage)
		}

		if (!emptyCheck.shouldContinue) {
			return emptyCheck.isValid
		}

		// 2. Valider le format
		const formatValidation = validateDateFormat(
			value,
			format,
			format,
			unref(options.required),
			options.hasInteracted?.value ?? false,
			!ctx.shouldDisplayErrors(),
		)
		if (!formatValidation.isValid) {
			if (ctx.shouldDisplayErrors()) {
				ctx.pushError(formatValidation.message)
			}
			return false
		}

		// 3. Parser la date
		const date = options.parseDate?.(value, format) ?? null
		if (!date) {
			if (ctx.shouldDisplayErrors()) {
				ctx.pushError(locales.invalidDateFormatWithFormat(format))
			}
			return false
		}

		// 4. Valider avec les custom rules
		return !!(await validateCustomRulesForDate(date))
	}

	const validateTextInput = async (value: string): Promise<boolean> => {
		ctx.clearValidation()

		// 1. Mode Vuetify natif
		if (unref(options.useVuetifyValidation)) {
			const hasInteracted = options.hasInteracted?.value ?? false
			if (!hasInteracted && !ctx.shouldDisplayErrors()) {
				return true
			}
			if (!hasInteracted) {
				ctx.clearValidation()
				return true
			}
			const result = await Promise.resolve(ctx.validation.validateValue(value))
			return !result.hasError
		}

		// 2. Valeur vide → valider required + custom rules sur null
		if (!value || value.trim() === '') {
			if (unref(options.required) && (options.hasInteracted?.value ?? false) && !unref(options.readonly) && ctx.shouldDisplayErrors()) {
				ctx.pushError(locales.required)
				return false
			}
			// Si des customRules existent et que l'utilisateur a interagi, les exécuter sur null
			// (permet aux règles métier de valider les champs vides, ex: date obligatoire conditionnelle)
			if (options.customRules.value.length > 0 && (options.hasInteracted?.value ?? false)) {
				const adapted = getAdaptedRules(options.customRules.value, options.customWarningRules.value, options.customSuccessRules?.value ?? [])
				const result = await ctx.validateField(
					null,
					adapted.customRules,
					adapted.warningRules,
					adapted.successRules,
				)
				return !result.hasError
			}
			return true
		}

		// 3. Plage de dates (avec séparateur)
		if (unref(options.displayRange) && value.includes(locales.rangeSeparator)) {
			const [startDateText = '', endDateText = ''] = value.split(locales.rangeSeparator)

			// Si seulement la date de début est saisie, valider juste celle-ci
			if (startDateText && !endDateText) {
				return await validateSingleTextInput(startDateText)
			}

			// Si ni start ni end n'est saisie, retourner l'état courant
			if (!(startDateText && endDateText)) {
				return !ctx.displayHasError.value
			}

			// Valider le format des deux dates
			const format = unref(options.displayFormat) ?? ''
			const startFormatValidation = validateDateFormat(startDateText, format, format, unref(options.required), options.hasInteracted?.value ?? false, !ctx.shouldDisplayErrors())
			const endFormatValidation = validateDateFormat(endDateText, format, format, unref(options.required), options.hasInteracted?.value ?? false, !ctx.shouldDisplayErrors())
			if (!startFormatValidation.isValid) {
				if (ctx.shouldDisplayErrors()) ctx.pushError(startFormatValidation.message)
				return false
			}
			if (!endFormatValidation.isValid) {
				if (ctx.shouldDisplayErrors()) ctx.pushError(endFormatValidation.message)
				return false
			}

			// Parser les deux dates
			const startDate = options.parseDate?.(startDateText, format) ?? null
			const endDate = options.parseDate?.(endDateText, format) ?? null

			if (!(startDate && endDate)) {
				return !ctx.displayHasError.value
			}

			// Valider la plage (start <= end)
			// Note : on appelle getRangeValidationError directement (et non useDateRangeValidation)
			// car les dates sont parsées depuis le texte et ne sont pas encore dans selectedDates.
			const rangeErrors: string[] = []
			const rangeError = getRangeValidationError(startDate, endDate)
			if (rangeError && ctx.shouldDisplayErrors()) {
				rangeErrors.push(rangeError)
			}

			// Valider les custom rules pour chaque date, puis fusionner les résultats
			await validateCustomRulesForDate(startDate)
			const startErrors = [...ctx.errors.value]
			const startWarnings = [...ctx.warnings.value]
			const startSuccesses = [...ctx.successes.value]

			await validateCustomRulesForDate(endDate)
			// Fusionner : range errors + start errors + end errors
			ctx.replaceErrors([...rangeErrors, ...startErrors, ...ctx.errors.value])
			ctx.warnings.value = [...new Set([...startWarnings, ...ctx.warnings.value].filter(Boolean))]
			ctx.successes.value = [...new Set([...startSuccesses, ...ctx.successes.value].filter(Boolean))]

			return !ctx.displayHasError.value
		}

		// 4. Date unique
		return await validateSingleTextInput(value)
	}

	return { validateTextInput }
}
