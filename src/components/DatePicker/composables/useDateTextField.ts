import type { Ref } from 'vue'
import type { ValidationResult } from '@/composables/validation/useValidation'
import type { DateValue } from '@/composables/date/useDateInitializationDayjs'
import { useManualDateValidation } from './useManualDateValidation'

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
	validateField: (value: unknown, rules?: any[], warningRules?: any[]) => ValidationResult
}

export interface UseDateTextFieldSubmitOptions {
	isValidating: Ref<boolean>
	hasInteracted: Ref<boolean>
	inputValue: Ref<string>
	runRules: (value: string) => boolean
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
	emitModel: (value: DateValue) => void
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

	const { validateManualInput } = useManualDateValidation({
		format: displayFormat.value,
		required: manualValidation.required,
		disableErrorHandling: manualValidation.disableErrorHandling,
		customRules: manualValidation.customRules,
		customWarningRules: manualValidation.customWarningRules,
		hasInteracted: manualValidation.hasInteracted,
		errors: manualValidation.errors,
		clearValidation: manualValidation.clearValidation,
		validateDateFormat: manualValidation.validateDateFormat,
		isDateComplete: manualValidation.isDateComplete,
		parseDate: manualValidation.parseDate,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		validateField: manualValidation.validateField as (value: unknown, rules?: any[], warningRules?: any[]) => ValidationResult,
	})

	const validateOnSubmit = () => {
		if (!submit) return true
		const { isValidating, hasInteracted, inputValue, runRules } = submit
		isValidating.value = true
		hasInteracted.value = true
		const ok = runRules(inputValue.value)
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

			return formattedEndDate ? `${formattedStartDate} - ${formattedEndDate}` : formattedStartDate
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
