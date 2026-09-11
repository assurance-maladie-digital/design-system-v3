import { ref, toValue, watch, type MaybeRefOrGetter, type Ref } from 'vue'
import { formatDate, parseDate } from '@/composables/date/useDateFormatDayjs'
import type { DatePickerLiteRange } from '../types'

type PickerMode = 'single' | 'range'

function isDateValue(value: unknown): value is Date {
	return value instanceof Date && Number.isFinite(value.getTime())
}

function isDateRange(value: unknown): value is DatePickerLiteRange {
	return Array.isArray(value)
		&& value.length === 2
		&& value.every(isDateValue)
}

// A model incoherent with the mode (e.g. a range received in single mode) formats to nothing
function formatValue(mode: PickerMode, value: Date | DatePickerLiteRange | undefined, inputFormat: string, separator: string): string | undefined {
	if (mode === 'range') {
		return isDateRange(value) ? `${formatDate(value[0], inputFormat)}${separator}${formatDate(value[1], inputFormat)}` : undefined
	}
	return isDateValue(value) ? formatDate(value, inputFormat) : undefined
}

// Both range bounds must parse to emit; range-order rules stay in the root validation
function parseValue(mode: PickerMode, value: string | null, inputFormat: string, separator: string): Date | DatePickerLiteRange | undefined {
	if (value === null) return undefined
	if (mode === 'range') {
		const [startStr, endStr] = value.split(separator)
		const start = startStr ? parseDate(startStr, inputFormat) : null
		const end = endStr ? parseDate(endStr, inputFormat) : null
		return start && end ? [start, end] : undefined
	}
	return parseDate(value, inputFormat) ?? undefined
}

function sameValue(mode: PickerMode, a: Date | DatePickerLiteRange | undefined, b: Date | DatePickerLiteRange | undefined): boolean {
	if (mode === 'range') {
		return isDateRange(a) && isDateRange(b) && a[0].getTime() === b[0].getTime() && a[1].getTime() === b[1].getTime()
	}
	return isDateValue(a) && isDateValue(b) && a.getTime() === b.getTime()
}

/**
 * Text state of the date field, converted from/to the model depending on the mode (single date or range).
 */
export interface UseDateInputModel {
	/** Raw text displayed in the field; drives the root validation since an incomplete input never parses to a Date */
	textValue: Ref<string | null | undefined>
}

/**
 * Handles the two-way conversion between the text typed in the field and the picker model:
 * formats the model for display, parses the text into a date or a range, without echoing back
 * when the model changes externally or the re-entered value is identical.
 */
export function useDateInputModel(
	mode: MaybeRefOrGetter<PickerMode>,
	modelValue: Ref<Date | DatePickerLiteRange | undefined>,
	inputFormat: MaybeRefOrGetter<string>,
	separator: MaybeRefOrGetter<string>,
	emit: (value: Date | DatePickerLiteRange | undefined) => void,
): UseDateInputModel {
	const textValue = ref<string | null | undefined>(formatValue(toValue(mode), modelValue.value, toValue(inputFormat), toValue(separator)))

	watch(
		modelValue,
		(newValue) => {
			const formatted = formatValue(toValue(mode), newValue, toValue(inputFormat), toValue(separator))
			if (textValue.value !== formatted) {
				textValue.value = formatted
			}
		},
	)

	watch(textValue, (newValue) => {
		if (newValue === undefined || newValue === null || newValue === '') {
			if (modelValue.value !== undefined) {
				emit(undefined)
			}
			return
		}
		const parsed = parseValue(toValue(mode), newValue, toValue(inputFormat), toValue(separator))
		if (parsed && !sameValue(toValue(mode), parsed, modelValue.value)) {
			emit(parsed)
		}
	}, { immediate: true })

	return { textValue }
}
