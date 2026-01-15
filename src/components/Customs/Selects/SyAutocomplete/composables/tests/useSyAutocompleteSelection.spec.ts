import { describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'

import { useSyAutocompleteSelection } from '../useSyAutocompleteSelection'
import type { ItemType, SelectItemArrayType, SelectItemValueType } from '../../types'

describe('useSyAutocompleteSelection', () => {
	it('clearSelection resets model in single mode and emits updates', () => {
		const emitUpdateModelValue = vi.fn()
		const emitUpdateSearch = vi.fn()
		const selectedItem = ref<SelectItemValueType | SelectItemArrayType>('FR')
		const searchValue = ref('France')

		const { clearSelection } = useSyAutocompleteSelection({
			multiple: ref(false),
			chips: ref(false),
			returnObject: ref(false),
			textKey: ref('text'),
			valueKey: ref('value'),
			plainTextKey: ref(undefined),
			allowHtml: ref(false),
			internalItems: ref([{ text: 'France', value: 'FR' }] as unknown as ItemType[]),
			selectedItem,
			searchValue,
			isOpen: ref(true),
			markTouched: vi.fn(),
			updateHasError: vi.fn(),
			ensureNativeInputFocus: vi.fn(),
			emitUpdateModelValue,
			emitUpdateSearch,
		})

		clearSelection()
		expect(selectedItem.value).toBe(null)
		expect(searchValue.value).toBe('')
		expect(emitUpdateModelValue).toHaveBeenCalledWith(null)
		expect(emitUpdateSearch).toHaveBeenCalledWith('')
	})
})
