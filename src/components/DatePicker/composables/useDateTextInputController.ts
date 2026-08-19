import { type Ref, type MaybeRef, unref } from 'vue'
import type { DateModelValue } from '@/composables/date/useDateInitializationDayjs'
import { useDatePickerManualValidation, type DatePickerManualValidationOptions } from './useDatePickerManualValidation'
import { locales } from '../locales'

export type UseDateTextFieldManualValidationOptions = Omit<DatePickerManualValidationOptions, 'displayFormat'>

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
	emitModel: (value: DateModelValue) => void
}

export interface UseDateTextInputControllerOptions {
	autoClamp: MaybeRef<boolean>
	isRange: Ref<boolean>
	displayFormat: Ref<string>
	autoClampDate: (dateStr: string, format: string) => { clampedDate: string, adjusted: boolean }
	manualValidation: UseDateTextFieldManualValidationOptions
	submit: UseDateTextFieldSubmitOptions
	reset: UseDateTextFieldResetOptions
}

/**
 * Contrôleur interne du flux DateTextInput.
 * Centralise l'auto-clamp, la validation manuelle, la soumission et le reset.
 */
export const useDateTextInputController = (options: UseDateTextInputControllerOptions) => {
	const { autoClamp, isRange, displayFormat, autoClampDate, manualValidation, submit, reset: resetOptions } = options
	const { validateManualInput } = useDatePickerManualValidation({
		...manualValidation,
		displayFormat,
	})

	const validateOnSubmit = async () => {
		const { isValidating, hasInteracted, inputValue, runRules } = submit
		isValidating.value = true
		hasInteracted.value = true

		try {
			return await runRules(inputValue.value)
		}
		finally {
			isValidating.value = false
		}
	}

	const clampDatePart = (value: string): string => {
		if (!value) return value

		return autoClampDate(value, displayFormat.value).clampedDate
	}

	const clampRangeInput = (raw: string): string => {
		const [rawStartDate = '', rawEndDate = ''] = raw.split(locales.rangeSeparator).map(dateText => dateText.trim())
		const clampedStartDate = clampDatePart(rawStartDate)
		const clampedEndDate = clampDatePart(rawEndDate)

		return clampedEndDate
			? `${clampedStartDate}${locales.rangeSeparator}${clampedEndDate}`
			: `${clampedStartDate}${locales.rangeSeparator}`
	}

	const clampIfNeeded = (raw: string): string => {
		if (!unref(autoClamp) || !raw) return raw

		if (isRange.value && raw.includes(locales.rangeSeparator)) {
			return clampRangeInput(raw)
		}

		return clampDatePart(raw)
	}

	const reset = () => {
		const {
			clearValidation,
			isFocused,
			hasInteracted,
			isDisabled,
			fieldKey,
			isFormatting,
			inputValue,
			selectedDates,
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
