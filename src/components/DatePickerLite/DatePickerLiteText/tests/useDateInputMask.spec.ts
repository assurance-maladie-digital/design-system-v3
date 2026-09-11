import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import type { DatePickerLiteMode } from '../../types'
import { useDateInputMask } from '../useDateInputMask'

describe('useDateInputMask', () => {
	it('creates a mask from the date input format', () => {
		const mask = useDateInputMask('single', 'YYYY-MM-DD', ' - ')

		expect(mask.value).toBe('####-##-##')
	})

	it('adds the separator between both date masks in range mode', () => {
		const mask = useDateInputMask('range', 'DD/MM/YYYY', ' au ')

		expect(mask.value).toBe('##/##/#### au ##/##/####')
	})

	it('does not constrain the number of dates in multiple mode', () => {
		const mask = useDateInputMask('multiple', 'DD/MM/YYYY', ', ')

		expect(mask.value).toBeUndefined()
	})

	it('updates the mask when its reactive inputs change', () => {
		const mode = ref<DatePickerLiteMode>('single')
		const inputFormat = ref('DD/MM/YYYY')
		const separator = ref(' - ')
		const mask = useDateInputMask(mode, inputFormat, separator)

		expect(mask.value).toBe('##/##/####')

		mode.value = 'range'
		inputFormat.value = 'YYYY.MM.DD'
		separator.value = ' to '

		expect(mask.value).toBe('####.##.## to ####.##.##')
	})
})
