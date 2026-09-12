import { computed, toValue, type ComputedRef, type MaybeRefOrGetter } from 'vue'
import type { DatePickerLiteMode } from '../types'

/**
 * Creates the Maska pattern for a date input according to its format and selection mode.
 */
export function useDateInputMask(
	mode: MaybeRefOrGetter<DatePickerLiteMode>,
	inputFormat: MaybeRefOrGetter<string>,
	separator: MaybeRefOrGetter<string>,
): ComputedRef<string | undefined> {
	return computed(() => {
		if (toValue(mode) === 'multiple') return undefined
		const format = toValue(inputFormat).replace(/[DMY]/g, '#')
		if (toValue(mode) === 'single') return format
		return `${format}${toValue(separator)}${format}`
	})
}
