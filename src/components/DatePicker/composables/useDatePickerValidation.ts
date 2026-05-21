import { watch, type Ref } from 'vue'
import { useValidation, type ValidationResult, type ValidationRule } from '@/composables/validation/useValidation'
import { DATE_PICKER_MESSAGES } from '../constants/messages'
import type { DateObjectValue } from '../types'

export type DatePickerValidationRule = {
	type: string
	// eslint-disable-next-line @typescript-eslint/no-explicit-any -- DatePicker rules are still legacy-shaped during migration.
	options: any
}

export type DatePickerValidationOptions = {
	showSuccessMessages: boolean
	disableErrorHandling: boolean
	noCalendar: boolean
	required: boolean
	displayRange: boolean
	customRules: Ref<DatePickerValidationRule[]>
	customWarningRules: Ref<DatePickerValidationRule[]>
	selectedDates: Ref<DateObjectValue>
	isUpdatingFromInternal: Ref<boolean>
	currentRangeIsValid: Ref<boolean>
	getRangeValidationError: Ref<string>
	readonly?: Ref<boolean>
	skipValidationWhenReadonly?: boolean
	useCalendarModeRequiredFlow?: boolean
	isInitialValidation?: Ref<boolean>
	isValidateOnBlur?: Ref<boolean>
	onblur?: Ref<boolean>
	fieldIdentifier?: string
	revalidateOnCustomRulesChange?: boolean
}

const emptyValidationResult = (): ValidationResult => ({
	hasError: false,
	hasWarning: false,
	hasSuccess: false,
	state: {
		errors: [],
		warnings: [],
		successes: [],
	},
})

export function useDatePickerValidation(options: DatePickerValidationOptions) {
	// Utiliser useValidation pour la validation de base
	const validation = useValidation({
		showSuccessMessages: options.showSuccessMessages,
		fieldIdentifier: options.fieldIdentifier ?? 'Date',
		disableErrorHandling: options.disableErrorHandling,
	})

	const {
		errors,
		warnings,
		successes,
		validateField: baseValidateField,
		clearValidation: baseClearValidation,
	} = validation

	const clearValidation = () => baseClearValidation()

	if (options.skipValidationWhenReadonly && options.readonly) {
		watch(options.readonly, () => {
			errors.value = []
			warnings.value = []
			successes.value = []
		})
	}

	const validateField = (
		value: unknown,
		rules: ValidationRule[] = [],
		warningRules: ValidationRule[] = [],
		successRules: ValidationRule[] = [],
	): Promise<ValidationResult> | ValidationResult => {
		if (options.skipValidationWhenReadonly && options.readonly?.value) {
			return emptyValidationResult()
		}

		return baseValidateField(value, rules, warningRules, successRules)
	}

	// Validation des ranges (intégrée de useDateRangeValidation)
	const isRangeValid = (startDate: Date | null | undefined, endDate: Date | null | undefined): boolean => {
		if (!startDate || !endDate) return true
		return startDate.getTime() <= endDate.getTime()
	}

	// Validation des dates (fusionnée de useDateValidation)
	const validateDates = (forceValidation = false): ValidationResult | Promise<ValidationResult> => {
		const customRules = options.customRules.value
		const customWarningRules = options.customWarningRules.value

		if (options.noCalendar) {
			// En mode no-calendar, on délègue la validation au DateTextInput
			return {
				hasError: false,
				hasWarning: false,
				hasSuccess: false,
				state: {
					errors: [],
					warnings: [],
					successes: [],
				},
			}
		}

		// Réinitialiser la validation
		clearValidation()

		// Si la gestion des erreurs est désactivée, on effectue la validation interne
		// mais on n'ajoute pas les messages d'erreur
		const shouldDisplayErrors = !options.disableErrorHandling

		// Vérifier si le champ est requis et vide
		if ((forceValidation || !options.isUpdatingFromInternal.value) && options.required && (!options.selectedDates.value || (Array.isArray(options.selectedDates.value) && options.selectedDates.value.length === 0))) {
			// Respecter isInitialValidation pour ne pas afficher l'erreur au chargement initial
			if (options.isInitialValidation?.value && !forceValidation) {
				return {
					hasError: false,
					hasWarning: false,
					hasSuccess: false,
					state: {
						errors: [],
						warnings: [],
						successes: [],
					},
				}
			}
			if (shouldDisplayErrors) {
				errors.value.push(DATE_PICKER_MESSAGES.ERROR_REQUIRED)
				return {
					hasError: true,
					hasWarning: false,
					hasSuccess: false,
					state: {
						errors: [DATE_PICKER_MESSAGES.ERROR_REQUIRED],
						warnings: [],
						successes: [],
					},
				}
			}
			else {
				return {
					hasError: true,
					hasWarning: false,
					hasSuccess: false,
					state: {
						errors: [],
						warnings: [],
						successes: [],
					},
				}
			}
		}

		if (!options.selectedDates.value) {
			return {
				hasError: false,
				hasWarning: false,
				hasSuccess: true,
				state: {
					errors: [],
					warnings: [],
					successes: [],
				},
			}
		}

		// Détecter si nous sommes en train de saisir une plage incomplète
		if (options.displayRange && Array.isArray(options.selectedDates.value)
			&& options.selectedDates.value.length === 2 && options.selectedDates.value[0] && !options.selectedDates.value[1]
			&& !forceValidation) {
			return {
				hasError: false,
				hasWarning: false,
				hasSuccess: false,
				state: {
					errors: [],
					warnings: [],
					successes: [],
				},
			}
		}

		// Préparer les dates à valider
		const datesToValidate = Array.isArray(options.selectedDates.value)
			? options.selectedDates.value.filter(Boolean)
			: [options.selectedDates.value]

		const finalizeValidation = (isValid: boolean): ValidationResult => {
			let finalIsValid = isValid

			// Vérifier la validité de la plage de dates si en mode plage
			if (options.displayRange && Array.isArray(options.selectedDates.value) && options.selectedDates.value.length >= 2) {
				const startDate = options.selectedDates.value[0]
				const endDate = options.selectedDates.value[options.selectedDates.value.length - 1]

				if (startDate && endDate && startDate.getTime() > endDate.getTime()) {
					const rangeError = DATE_PICKER_MESSAGES.ERROR_END_BEFORE_START
					if (!errors.value.includes(rangeError)) {
						errors.value.push(rangeError)
						finalIsValid = false
					}
				}
				else if (!options.currentRangeIsValid.value) {
					const rangeError = options.getRangeValidationError.value
					if (rangeError && !errors.value.includes(rangeError)) {
						errors.value.push(rangeError)
						finalIsValid = false
					}
				}
			}

			errors.value = [...new Set(errors.value)]
			warnings.value = [...new Set(warnings.value)]
			successes.value = [...new Set(successes.value)]

			return {
				hasError: !finalIsValid,
				hasWarning: warnings.value.length > 0,
				hasSuccess: successes.value.length > 0 && finalIsValid && warnings.value.length === 0,
				state: {
					errors: errors.value,
					warnings: warnings.value,
					successes: successes.value,
				},
			}
		}

		if (!shouldDisplayErrors) {
			return finalizeValidation(true)
		}

		const validationResults = datesToValidate
			.filter(Boolean)
			.map(date => validateField(date, customRules, customWarningRules))

		if (validationResults.some(result => result instanceof Promise)) {
			return Promise
				.all(validationResults.map(result => Promise.resolve(result)))
				.then((resolvedResults) => {
					const hasError = resolvedResults.some(result => result.hasError)
					return finalizeValidation(!hasError)
				})
		}

		const hasError = (validationResults as ValidationResult[]).some(result => result.hasError)
		return finalizeValidation(!hasError)
	}

	// Validation CalendarMode required flow
	const validateCalendarModeDates = async (forceValidation = false) => {
		if (!options.useCalendarModeRequiredFlow) {
			return await Promise.resolve(validateDates(forceValidation))
		}

		if (options.noCalendar) {
			return
		}

		clearValidation()

		const shouldDisplayErrors = !options.disableErrorHandling
		const hasNoSelection = !options.selectedDates.value || (Array.isArray(options.selectedDates.value) && options.selectedDates.value.length === 0)

		if ((forceValidation || !options.isUpdatingFromInternal.value) && options.required && hasNoSelection) {
			if (options.readonly?.value) {
				return
			}
			// Respecter isValidateOnBlur même quand forceValidation est true
			if (options.onblur?.value && !options.isValidateOnBlur?.value) {
				return
			}
			// Ne jamais afficher l'erreur required lors de la validation initiale
			if (options.isInitialValidation?.value) {
				return
			}
			if (shouldDisplayErrors) {
				errors.value.push(DATE_PICKER_MESSAGES.ERROR_REQUIRED)
			}
			return
		}

		if (!options.selectedDates.value) {
			if (!options.customRules.value || options.customRules.value.length === 0) return

			if (shouldDisplayErrors && (!options.isInitialValidation?.value || forceValidation)) {
				await validateField(
					options.selectedDates.value,
					options.customRules.value,
					options.customWarningRules.value,
				)
				errors.value = [...new Set(errors.value)]
				warnings.value = [...new Set(warnings.value)]
				successes.value = [...new Set(successes.value)]
			}
			return
		}

		if (shouldDisplayErrors && (!options.isInitialValidation?.value || forceValidation)) {
			return await Promise.resolve(validateDates(forceValidation))
		}
	}

	// Revalidation sur changement des customRules
	if (options.revalidateOnCustomRulesChange) {
		watch(options.customRules, () => {
			if (options.selectedDates.value === null) {
				return
			}

			queueMicrotask(async () => {
				clearValidation()

				const datesToValidate = Array.isArray(options.selectedDates.value)
					? options.selectedDates.value
					: [options.selectedDates.value]

				for (const date of datesToValidate) {
					await Promise.resolve(validateField(
						date,
						options.customRules.value,
						options.customWarningRules.value,
					))
				}
			})
		}, { deep: true })
	}

	// Watcher sur selectedDates pour la validation automatique (seulement si pas de mode CalendarMode spécifique)
	if (!options.useCalendarModeRequiredFlow) {
		watch(options.selectedDates, (newDates) => {
			if (newDates === null || (Array.isArray(newDates) && newDates.length === 0)) {
				clearValidation()
			}
		})
	}

	return {
		validation,
		errors,
		warnings,
		successes,
		errorMessages: errors,
		warningMessages: warnings,
		successMessages: validation.displaySuccesses,
		clearValidation,
		validateField,
		validateDates,
		validateCalendarModeDates,
		isRangeValid,
	}
}
