import { describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'

import { useSyAutocompleteKeydown } from '../useSyAutocompleteKeydown'

describe('useSyAutocompleteKeydown', () => {
	it('removes last chip on Backspace when multiple and search empty', async () => {
		const removeChip = vi.fn()
		const focusInputElement = vi.fn()

		const { onNativeInputKeydown } = useSyAutocompleteKeydown({
			textInput: ref({ $el: document.createElement('div') } as unknown as { $el?: HTMLElement }),
			isOpen: ref(true),
			multiple: ref(true),
			selectedItem: ref(['a', 'b']),
			searchValue: ref(''),
			handleTabKey: vi.fn(),
			handleInputDownKey: vi.fn(),
			handleInputUpKey: vi.fn(),
			handleListDownKey: vi.fn(),
			handleListUpKey: vi.fn(),
			handleListEscapeKey: vi.fn(),
			handleHomeKey: vi.fn(),
			handleEndKey: vi.fn(),
			handlePageUpKey: vi.fn(),
			handlePageDownKey: vi.fn(),
			handleEnterKey: vi.fn(),
			handleSpaceKey: vi.fn(),
			handleEscapeKey: vi.fn(),
			removeChip,
			focusInputElement,
			ensureNativeInputFocus: vi.fn(),
		})

		onNativeInputKeydown(new KeyboardEvent('keydown', { key: 'Backspace' }))
		await nextTick()
		expect(removeChip).toHaveBeenCalledWith('b')
		expect(focusInputElement).toHaveBeenCalled()
	})
})
