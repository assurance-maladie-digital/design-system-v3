import { useValidatable } from '@/composables/validation/useValidatable'
import { useValidation } from '@/composables/validation/useValidation'
import type { MaybeRefOrGetter } from 'vue'
import { toValue, type ComputedRef } from 'vue'
import { useLunarCalendarRules } from './useLunarCalendarRules'

export function useLunarCalendarValidation(
	modelValue: ComputedRef<string | undefined>,
	label: MaybeRefOrGetter<string | undefined>,
	minYear: MaybeRefOrGetter<number | undefined>,
	maxYear: MaybeRefOrGetter<number | undefined>,
) {
	const { rules } = useLunarCalendarRules(
		minYear,
		maxYear,
	)

	const validation = useValidation({
		customRules: rules.value,
		showSuccessMessages: false,
		fieldIdentifier: toValue(label),
	})

	function validateOnSubmit() {
		const result = validation.validateField(
			modelValue.value,
			rules.value,
		)

		return !result.hasError
	}

	useValidatable(validateOnSubmit, validation.clearValidation)

	function validate() {
		return validation.validateField(
			modelValue.value,
			rules.value,
		)
	}

	return { ...validation, validate }
}
