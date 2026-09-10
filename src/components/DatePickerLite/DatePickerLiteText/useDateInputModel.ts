import { computed, ref, toValue, watch, type ComputedRef, type MaybeRefOrGetter, type Ref } from 'vue'
import { formatDate, parseDate } from '@/composables/date/useDateFormatDayjs'
import type { DatePickerLiteRange } from '../types'

type PickerMode = 'single' | 'range'

const DATE_FORMAT = 'DD/MM/YYYY'
const RANGE_SEPARATOR = ' - '

function isDateValue(value: unknown): value is Date {
	return value instanceof Date && Number.isFinite(value.getTime())
}

function isDateRange(value: unknown): value is DatePickerLiteRange {
	return Array.isArray(value)
		&& value.length === 2
		&& value.every(isDateValue)
}

// A model incoherent with the mode (e.g. a range received in single mode) formats to nothing
function formatValue(mode: PickerMode, value: Date | DatePickerLiteRange | undefined): string | undefined {
	if (mode === 'range') {
		return isDateRange(value) ? `${formatDate(value[0], DATE_FORMAT)}${RANGE_SEPARATOR}${formatDate(value[1], DATE_FORMAT)}` : undefined
	}
	return isDateValue(value) ? formatDate(value, DATE_FORMAT) : undefined
}

// Both range bounds must parse to emit; range-order rules stay in the root validation
function parseValue(mode: PickerMode, value: string): Date | DatePickerLiteRange | undefined {
	if (mode === 'range') {
		const [startStr, endStr] = value.split(RANGE_SEPARATOR)
		const start = startStr ? parseDate(startStr, DATE_FORMAT) : null
		const end = endStr ? parseDate(endStr, DATE_FORMAT) : null
		return start && end ? [start, end] : undefined
	}
	return parseDate(value, DATE_FORMAT) ?? undefined
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
	textValue: Ref<string | undefined>
	mask: ComputedRef<string>
}

/**
 * Handles the two-way conversion between the text typed in the field and the picker model:
 * formats the model for display, parses the text into a date or a range, without echoing back
 * when the model changes externally or the re-entered value is identical.
 */
export function useDateInputModel(
	mode: MaybeRefOrGetter<PickerMode>,
	modelValue: Ref<Date | DatePickerLiteRange | undefined>,
	emit: (value: Date | DatePickerLiteRange | undefined) => void,
): UseDateInputModel {
	const mask = computed(() => toValue(mode) === 'range' ? `##/##/####${RANGE_SEPARATOR}##/##/####` : '##/##/####')

	const textValue = ref<string | undefined>(formatValue(toValue(mode), modelValue.value))

	watch(
		modelValue,
		(newValue) => {
			const formatted = formatValue(toValue(mode), newValue)
			if (textValue.value !== formatted) {
				textValue.value = formatted
			}
		},
	)

	watch(textValue, (newValue) => {
		if (newValue === undefined || newValue === '') {
			if (modelValue.value !== undefined) {
				emit(undefined)
			}
			return
		}
		const parsed = parseValue(toValue(mode), newValue)
		if (parsed && !sameValue(toValue(mode), parsed, modelValue.value)) {
			emit(parsed)
		}
	}, { immediate: true })

	return { textValue, mask }
}
