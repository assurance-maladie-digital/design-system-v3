import { computed, toValue, type ComputedRef, type MaybeRefOrGetter } from 'vue'

type PickerMode = 'single' | 'range'

/**
 * Creates the Maska pattern for a date input according to its format and selection mode.
 */
export function useDateInputMask(
	mode: MaybeRefOrGetter<PickerMode>,
	inputFormat: MaybeRefOrGetter<string>,
	separator: MaybeRefOrGetter<string>,
): ComputedRef<string> {
	return computed(() => {
		const format = toValue(inputFormat).replace(/[DMY]/g, '#')
		return toValue(mode) === 'range' ? `${format}${toValue(separator)}${format}` : format
	})
}
