import { computed, toValue, watch, type MaybeRefOrGetter, type Ref } from 'vue'
import { formatValue, parseValue, sameValue } from './dateValueConversion'
import type { DatePickerLiteMode, DatePickerLiteValue } from '../types'

interface UseDatePickerLiteTextSyncOptions {
	mode: MaybeRefOrGetter<DatePickerLiteMode>
	inputFormat: MaybeRefOrGetter<string>
	separator: MaybeRefOrGetter<string>
	locale: MaybeRefOrGetter<string>
	/** Model ref returned by `defineModel` */
	internalValue: Ref<DatePickerLiteValue | undefined>
	/** Text of the field, shared with the validation and wiring composables */
	textValue: Ref<string | null | undefined>
	/** User-driven model change (typed text or clear): updates the model and emits `change` */
	onUserValueChange: (value: DatePickerLiteValue) => void
}

/**
 * Keeps the field text and the model in sync, both directions:
 * - model → text: initial display, picker selection, external model update, format/locale change
 * - text → model: typed text parsed per `inputFormat` (default input and custom slots alike)
 */
export function useDatePickerLiteTextSync(options: UseDatePickerLiteTextSyncOptions) {
	const modelValue = computed(() => options.internalValue.value ?? null)

	// The text itself only travels upward, from the input events. A model incoherent
	// with the mode formats to nothing: clear it as the typed text would.
	watch(
		[modelValue, () => toValue(options.mode), () => toValue(options.inputFormat), () => toValue(options.separator), () => toValue(options.locale)],
		() => {
			const formatted = formatValue(toValue(options.mode), modelValue.value, toValue(options.inputFormat), toValue(options.separator), toValue(options.locale))
			if (options.textValue.value !== formatted) {
				options.textValue.value = formatted
			}
			// An empty formatting (mode-mismatched model, or an emptied multiple selection)
			// clears the model, as typing empty text would
			if ((formatted === undefined || formatted === '') && options.internalValue.value != null) {
				options.onUserValueChange(null)
			}
		},
		{ immediate: true },
	)

	// The watch dedupes repeated input events carrying the same text
	watch(options.textValue, (value) => {
		if (value == null || value === '') {
			if (options.internalValue.value != null) {
				options.onUserValueChange(null)
			}
			return
		}
		const parsed = parseValue(toValue(options.mode), value, toValue(options.inputFormat), toValue(options.separator), toValue(options.locale))
		if (parsed && !sameValue(toValue(options.mode), parsed, modelValue.value)) {
			options.onUserValueChange(parsed)
		}
	})
}
