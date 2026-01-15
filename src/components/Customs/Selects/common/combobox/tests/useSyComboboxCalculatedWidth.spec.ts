import { describe, expect, it } from 'vitest'
import { ref } from 'vue'

import { useSyComboboxCalculatedWidth } from '../useSyComboboxCalculatedWidth'

describe('useSyComboboxCalculatedWidth', () => {
	it('returns undefined when width is empty or "undefined"', () => {
		const width = ref('')
		const { calculatedWidth } = useSyComboboxCalculatedWidth({ width })
		expect(calculatedWidth.value).toBeUndefined()

		width.value = 'undefined'
		expect(calculatedWidth.value).toBeUndefined()
	})

	it('adds px when width is a numeric string', () => {
		const width = ref('120')
		const { calculatedWidth } = useSyComboboxCalculatedWidth({ width })
		expect(calculatedWidth.value).toBe('120px')
	})

	it('keeps raw value when width is non-numeric', () => {
		const width = ref('50%')
		const { calculatedWidth } = useSyComboboxCalculatedWidth({ width })
		expect(calculatedWidth.value).toBe('50%')
	})
})
