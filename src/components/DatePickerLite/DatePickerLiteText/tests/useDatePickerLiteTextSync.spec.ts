import { describe, expect, it } from 'vitest'
import { nextTick, ref } from 'vue'
import type { DatePickerLiteValue } from '../../types'
import { useDatePickerLiteTextSync } from '../useDatePickerLiteTextSync'

describe('useDatePickerLiteTextSync', () => {
	it('parses localized month names from the typed text', async () => {
		const internalValue = ref<DatePickerLiteValue>(undefined)
		const textValue = ref<string | null | undefined>(undefined)
		const emittedValues: DatePickerLiteValue[] = []
		useDatePickerLiteTextSync({
			mode: 'single',
			inputFormat: 'D MMMM YYYY',
			separator: ' - ',
			locale: 'en-US',
			internalValue,
			textValue,
			onUserValueChange: value => emittedValues.push(value),
		})

		textValue.value = '4 September 2025'
		await nextTick()

		expect(emittedValues).toEqual([new Date(2025, 8, 4)])
	})

	it('formats the initial model value into the text field', () => {
		const internalValue = ref<DatePickerLiteValue>(new Date(2025, 8, 3))
		const textValue = ref<string | null | undefined>(undefined)
		useDatePickerLiteTextSync({
			mode: 'single',
			inputFormat: 'D MMMM YYYY',
			separator: ' - ',
			locale: 'fr-FR',
			internalValue,
			textValue,
			onUserValueChange: () => {},
		})

		expect(textValue.value).toBe('3 septembre 2025')
	})

	it('clears the model when the text is emptied', async () => {
		const internalValue = ref<DatePickerLiteValue>(new Date(2025, 8, 3))
		const textValue = ref<string | null | undefined>('3 septembre 2025')
		const emittedValues: DatePickerLiteValue[] = []
		useDatePickerLiteTextSync({
			mode: 'single',
			inputFormat: 'D MMMM YYYY',
			separator: ' - ',
			locale: 'fr-FR',
			internalValue,
			textValue,
			onUserValueChange: value => emittedValues.push(value),
		})

		textValue.value = ''
		await nextTick()

		expect(emittedValues).toEqual([null])
	})
})
