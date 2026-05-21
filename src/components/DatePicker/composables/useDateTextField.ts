import type { Ref } from 'vue'
import type { ValidationResult } from '@/composables/validation/useValidation'
import type { DateModelValue } from '@/composables/date/useDateInitializationDayjs'
import { validateDateFormat, isDateComplete } from './useDateFormatUtils'
import { validateEmptyOrIncompleteDate, adaptCustomRules } from '../utils/validationUtils'
import { DATE_PICKER_MESSAGES } from '../constants/messages'

export interface UseDateTextFieldManualValidationOptions {
	required: boolean
	disableErrorHandling: boolean
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	customRules: any
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	customWarningRules: any
	hasInteracted: Ref<boolean>
	errors: Ref<string[]>
	clearValidation: () => void
	validateDateFormat: (dateStr: string) => { isValid: boolean, message: string }
	isDateComplete: (value: string) => boolean
	parseDate: (dateStr: string, format: string) => Date | null
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	validateField: (value: unknown, rules?: any[], warningRules?: any[]) => Promise<ValidationResult>
}

export interface UseDateTextFieldSubmitOptions {
	isValidating: Ref<boolean>
	hasInteracted: Ref<boolean>
	inputValue: Ref<string>
	runRules: (value: string) => Promise<boolean>
}

export interface UseDateTextFieldResetOptions {
	clearValidation: () => void
	isFocused: Ref<boolean>
	hasInteracted: Ref<boolean>
	isDisabled: () => boolean
	fieldKey: Ref<number>
	isFormatting: Ref<boolean>
	inputValue: Ref<string>
	selectedDates: Ref<unknown>
	resetState: () => void
	emitModel: (value: DateModelValue) => void
}

export interface UseDateTextFieldOptions {
	autoClamp: boolean
	isRange: Ref<boolean>
	displayFormat: Ref<string>
	autoClampDate: (dateStr: string, format: string) => { clampedDate: string, adjusted: boolean }
	manualValidation: UseDateTextFieldManualValidationOptions
	submit?: UseDateTextFieldSubmitOptions
	reset?: UseDateTextFieldResetOptions
}

/**
 * Composable de haut niveau pour la saisie de date dans un champ texte.
 * Pour l'instant il encapsule uniquement la logique d'autoClamp
 * afin de pouvoir être partagé entre les différents scénarios (single / range).
 */
export const useDateTextField = (options: UseDateTextFieldOptions) => {
	const { autoClamp, isRange, displayFormat, autoClampDate, manualValidation, submit, reset: resetOptions } = options

	// Fonction locale de validation manuelle pour remplacer useManualDateValidation
	const validateManualInput = (value: string): boolean | Promise<boolean> => {
		manualValidation.clearValidation()

		// Vérifier les cas de champ vide ou incomplet
		const emptyCheck = validateEmptyOrIncompleteDate(
			value,
			manualValidation.required,
			(val: string) => isDateComplete(val, displayFormat.value),
			manualValidation.hasInteracted.value,
		)

		// Gérer les erreurs pour champ vide requis
		if (!emptyCheck.isValid && !manualValidation.disableErrorHandling && emptyCheck.errorMessage) {
			manualValidation.errors.value.push(DATE_PICKER_MESSAGES.ERROR_REQUIRED)
		}

		// Si on ne doit pas continuer la validation (champ vide/incomplet)
		if (!emptyCheck.shouldContinue) {
			return emptyCheck.isValid
		}

		// Valider le format de la date
		const formatValidation = validateDateFormat(
			value,
			displayFormat.value,
			displayFormat.value,
			manualValidation.required,
			manualValidation.hasInteracted.value,
			manualValidation.disableErrorHandling,
		)
		if (!formatValidation.isValid) {
			if (!manualValidation.disableErrorHandling && formatValidation.message) {
				manualValidation.errors.value.push(formatValidation.message)
			}
			return false
		}

		// Si le format est valide, vérifier si la date peut être parsée
		const date = manualValidation.parseDate(value, displayFormat.value)
		if (!date) {
			// La date n'a pas pu être parsée
			if (!manualValidation.disableErrorHandling) {
				manualValidation.errors.value.push(`Format de date invalide (${displayFormat.value})`)
			}
			return false
		}

		// Valider les règles personnalisées
		if (!manualValidation.disableErrorHandling) {
			const currentCustomRules = manualValidation.customRules
			const currentCustomWarningRules = manualValidation.customWarningRules

			// Filtrer les règles qui sont prêtes (ont une date définie)
			const readyRules = currentCustomRules.filter((rule: { type?: string, options?: { date?: unknown } }) => {
				if (rule.type === 'notBeforeDate' || rule.type === 'notAfterDate' || rule.type === 'exactDate') {
					return rule.options && rule.options.date !== undefined
				}
				return true
			})

			// Si aucune règle n'est prête, skip la validation
			if (readyRules.length === 0 && currentCustomRules.length > 0) {
				return true
			}

			// Adapter les règles prêtes pour maintenir la compatibilité avec les tests existants
			const safeCustomRules = adaptCustomRules(readyRules, displayFormat.value)
			const safeWarningRules = adaptCustomRules(currentCustomWarningRules, displayFormat.value)

			// Appeler validateField pour évaluer les règles
			const result = manualValidation.validateField(
				date,
				safeCustomRules,
				safeWarningRules,
			)

			if (result instanceof Promise) {
				return result.then(resolvedResult => !resolvedResult.hasError)
			}

			const validationResult = result as ValidationResult
			return !validationResult.hasError
		}

		return manualValidation.errors.value.length === 0
	}

	const validateOnSubmit = async () => {
		if (!submit) return true
		const { isValidating, hasInteracted, inputValue, runRules } = submit
		isValidating.value = true
		hasInteracted.value = true
		const ok = await runRules(inputValue.value)
		isValidating.value = false
		return ok
	}

	const clampIfNeeded = (raw: string): string => {
		if (!autoClamp || !raw) return raw

		if (isRange.value && raw.includes(' - ')) {
			const [rawStartDate = '', rawEndDate = ''] = raw.split(' - ').map(dateText => dateText.trim())
			const startDateValidation = rawStartDate
				? autoClampDate(rawStartDate, displayFormat.value)
				: { adjusted: false, clampedDate: rawStartDate }
			const endDateValidation = rawEndDate
				? autoClampDate(rawEndDate, displayFormat.value)
				: { adjusted: false, clampedDate: rawEndDate }

			const formattedStartDate = startDateValidation.clampedDate || ''
			const formattedEndDate = endDateValidation.clampedDate || ''

			return formattedEndDate ? `${formattedStartDate} - ${formattedEndDate}` : `${formattedStartDate} - `
		}

		const dateValidationResult = autoClampDate(raw, displayFormat.value)
		return dateValidationResult.clampedDate
	}

	const reset = () => {
		if (!resetOptions) return
		const {
			clearValidation,
			isFocused,
			hasInteracted,
			isDisabled,
			fieldKey,
			isFormatting,
			inputValue,
			selectedDates,
			resetState,
			emitModel,
		} = resetOptions

		// 1) Nettoyer l'état de validation et d'interaction
		clearValidation()
		isFocused.value = false
		hasInteracted.value = false

		if (isDisabled()) {
			fieldKey.value++
			return
		}

		// 2) Réinitialiser la valeur sans déclencher de validation interactive
		isFormatting.value = true
		inputValue.value = ''
		selectedDates.value = null
		resetState()
		isFormatting.value = false

		// 3) Synchroniser le modèle externe
		emitModel(null)

		// 4) Forcer la recréation du champ pour réinitialiser l'état interne de Vuetify
		fieldKey.value++
	}

	return {
		clampIfNeeded,
		validateManualInput,
		validateOnSubmit,
		reset,
	}
}

export default useDateTextField
