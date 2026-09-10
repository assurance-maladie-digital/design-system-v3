import { computed, type Ref } from 'vue'
import type { DatePickerLiteRange } from '../types'

export interface UseDatePickerLiteSelectionParams {
	modelValue: Ref<Date | DatePickerLiteRange | undefined>
	mode: Ref<'single' | 'range'>
}

export function useDatePickerLiteSelection({
	modelValue,
	mode,
}: UseDatePickerLiteSelectionParams) {
	/**
	 * In single mode, the model may still be a plain Date.
	 * In range mode, the model is a tuple; we keep the first value as the anchor date for the calendar header.
	 */
	const selectedDate = computed<Date | undefined>(() => {
		const value = modelValue.value
		return Array.isArray(value) ? value[0] : value
	})

	/**
	 * `selectedDateRange` exposes the actual range only when the component is in range mode.
	 * It keeps the list shape expected by the calendar for range highlighting.
	 */
	const selectedDateRange = computed<DatePickerLiteRange | undefined>(() => {
		return mode.value === 'range' && Array.isArray(modelValue.value) ? modelValue.value : undefined
	})

	/**
	 * `selectedDates` is the flattened form expected by the day cell selection logic.
	 * Single mode becomes a one-element array; range mode spreads the model tuple.
	 */
	const selectedDates = computed<Date[]>(() => {
		if (mode.value === 'range') {
			return selectedDateRange.value ? [...selectedDateRange.value] : []
		}
		return selectedDate.value ? [selectedDate.value] : []
	})

	/**
	 * The header should display a stable Date instance, not the raw model reference.
	 * Cloning it avoids accidental mutation when the calendar manipulates the displayed value.
	 */
	const headerDate = computed<Date | undefined>(() => {
		if (!selectedDate.value) return undefined
		return new Date(selectedDate.value)
	})

	return {
		selectedDate,
		selectedDateRange,
		selectedDates,
		headerDate,
	}
}
