import { describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'

import { useSyAutocompleteModel } from '../useSyAutocompleteModel'
import type { SelectItemArrayType, SelectItemValueType } from '../../types'

describe('useSyAutocompleteModel', () => {
	it('clears selectedItem when user types a different search (single)', async () => {
		const modelValue = ref<SelectItemValueType | SelectItemArrayType>('FR')
		const search = ref('')
		const multiple = ref(false)
		const minChars = ref(1)

		const selectedItem = ref<SelectItemValueType | SelectItemArrayType>('FR')
		const searchValue = ref('')
		const isOpen = ref(true)
		const pendingFocusIndex = ref<number | null>(null)

		const emitUpdateModelValue = vi.fn()
		const emitUpdateSearch = vi.fn()

		useSyAutocompleteModel({
			modelValue,
			search,
			multiple,
			minChars,
			getSelectedText: () => 'France',
			selectedItem,
			searchValue,
			isOpen,
			pendingFocusIndex,
			openMenu: vi.fn(),
			resetFetchState: vi.fn(),
			scheduleFetch: vi.fn(),
			clearActiveDescendant: vi.fn(),
			markTouched: vi.fn(),
			markOpenedByTyping: vi.fn(),
			emitUpdateModelValue,
			emitUpdateSearch,
		})

		searchValue.value = 'Fin'
		await nextTick()
		expect(emitUpdateSearch).toHaveBeenCalledWith('Fin')
		expect(emitUpdateModelValue).toHaveBeenCalledWith(null)
		expect(selectedItem.value).toBe(null)
	})
})
