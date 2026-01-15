import { describe, expect, it } from 'vitest'
import { computed } from 'vue'

import { useSyComboboxFormatItems } from '../useSyComboboxFormatItems'

describe('useSyComboboxFormatItems', () => {
	it('normalizes string items to objects using textKey/valueKey', () => {
		const items = computed(() => ['Apple', 'Banana'] as unknown as Array<Record<string, unknown>>)
		const textKey = computed(() => 'text')
		const valueKey = computed(() => 'value')

		const { formattedItems } = useSyComboboxFormatItems({ items, textKey, valueKey })
		expect(formattedItems.value).toEqual([
			{ text: 'Apple', value: 'Apple' },
			{ text: 'Banana', value: 'Banana' },
		])
	})

	it('keeps object items unchanged', () => {
		const items = computed(() => [{ text: 'A', value: 1 }] as Array<Record<string, unknown>>)
		const textKey = computed(() => 'text')
		const valueKey = computed(() => 'value')

		const { formattedItems } = useSyComboboxFormatItems({ items, textKey, valueKey })
		expect(formattedItems.value).toEqual([{ text: 'A', value: 1 }])
	})
})
