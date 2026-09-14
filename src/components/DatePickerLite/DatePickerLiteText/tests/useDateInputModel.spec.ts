import { describe, expect, it } from 'vitest'
import { nextTick, ref } from 'vue'
import type { DatePickerLiteValue } from '../../types'
import { useDateInputModel } from '../useDateInputModel'

describe('useDateInputModel', () => {
	it('parses localized month names', async () => {
		const modelValue = ref<DatePickerLiteValue>(null)
		const emittedValues: DatePickerLiteValue[] = []
		const { textValue } = useDateInputModel(
			'single',
			modelValue,
			'D MMMM YYYY',
			' - ',
			'en-US',
			value => emittedValues.push(value),
		)

		textValue.value = '4 September 2025'
		await nextTick()

		expect(emittedValues).toEqual([new Date(2025, 8, 4)])
	})

	it('uses the French fallback locale during SSR', () => {
		const { textValue } = useDateInputModel(
			'single',
			ref(new Date(2025, 8, 3)),
			'D MMMM YYYY',
			' - ',
			'fr-FR',
			() => {},
		)

		expect(textValue.value).toBe('3 septembre 2025')
	})
})
