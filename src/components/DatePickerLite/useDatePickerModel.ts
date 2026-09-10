import { computed, type Ref } from 'vue'
import type { DatePickerLiteRange } from './types'

export function isDateValue(value: unknown): value is Date {
	return value instanceof Date && Number.isFinite(value.getTime())
}

export function isDateRange(value: unknown): value is DatePickerLiteRange {
	return Array.isArray(value)
		&& value.length === 2
		&& value.every(isDateValue)
}

/**
 * Normalizes the model value according to the DatePicker selection mode.
 *
 * In "range" mode, the composable accepts only a valid two-date range.
 * In "single" mode, it allows only a single date.
 */
export function useDatePickerModel(
	mode: Ref<'single' | 'range'>,
	modelValue: Ref<Date | DatePickerLiteRange | undefined>,
) {
	const modelValueForInput = computed<Date | DatePickerLiteRange | undefined>({
		get: () => {
			if (mode.value === 'range') {
				return isDateRange(modelValue.value) ? modelValue.value : undefined
			}
			return isDateRange(modelValue.value) ? undefined : modelValue.value
		},
		set: (value) => {
			if (mode.value === 'range') {
				modelValue.value = isDateRange(value) ? value : undefined
				return
			}
			modelValue.value = isDateValue(value) ? value : undefined
		},
	})

	return {
		modelValueForInput,
	}
}
