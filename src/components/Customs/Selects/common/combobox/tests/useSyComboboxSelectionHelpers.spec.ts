import { describe, expect, it } from 'vitest'
import { ref } from 'vue'

import {
	useSyComboboxChipsHelpers,
	useSyComboboxGetItemText,
	useSyComboboxGetPlainItemText,
	useSyComboboxHasSelectionToClear,
	useSyComboboxIsItemSelected,
} from '../useSyComboboxSelectionHelpers'

describe('useSyComboboxSelectionHelpers', () => {
	it('getItemText reads key and always returns a string', () => {
		const textKey = ref('text')
		const { getItemText } = useSyComboboxGetItemText(textKey)
		expect(getItemText({ text: 123 })).toBe('123')
		expect(getItemText(null)).toBe('')
	})

	it('getPlainItemText prefers plainTextKey when allowHtml', () => {
		const textKey = ref('text')
		const plainTextKey = ref<string | undefined>('plain')
		const allowHtml = ref(true)
		const { getPlainItemText } = useSyComboboxGetPlainItemText({ textKey, plainTextKey, allowHtml })

		expect(getPlainItemText({ text: '<b>A</b>', plain: 'A' })).toBe('A')
	})

	it('isItemSelected works with multiple + returnObject', () => {
		const multiple = ref(true)
		const returnObject = ref(true)
		const valueKey = ref('id')
		const selectedItem = ref([{ id: 1, text: 'A' }])

		const { isItemSelected } = useSyComboboxIsItemSelected({ multiple, returnObject, valueKey, selectedItem })
		expect(isItemSelected({ id: 1, text: 'A' })).toBe(true)
		expect(isItemSelected({ id: 2, text: 'B' })).toBe(false)
	})

	it('chips helpers: hasChips, getChipKey, removeChip', () => {
		const chips = ref(true)
		const multiple = ref(true)
		const returnObject = ref(false)
		const textKey = ref('text')
		const valueKey = ref('value')
		const items = ref([{ text: 'A', value: 'a' }])
		const selectedItem = ref(['a'])
		const emitted: unknown[] = []

		const { hasChips, getChipKey, removeChip } = useSyComboboxChipsHelpers({
			chips,
			multiple,
			returnObject,
			textKey,
			valueKey,
			items,
			selectedItem,
			emitUpdateModelValue: v => emitted.push(v),
		})

		expect(hasChips.value).toBe(true)
		expect(getChipKey('a')).toBe('a')

		removeChip('a')
		expect(selectedItem.value).toEqual([])
		expect(emitted).toHaveLength(1)
	})

	it('hasSelectionToClear works for multiple and single', () => {
		const multiple = ref(true)
		const selectedItem = ref<unknown>([])
		const { hasSelectionToClear } = useSyComboboxHasSelectionToClear(
			multiple,
			selectedItem as unknown as Parameters<typeof useSyComboboxHasSelectionToClear>[1],
		)
		expect(hasSelectionToClear.value).toBe(false)

		selectedItem.value = ['x']
		expect(hasSelectionToClear.value).toBe(true)

		multiple.value = false
		selectedItem.value = null
		expect(hasSelectionToClear.value).toBe(false)
	})
})
