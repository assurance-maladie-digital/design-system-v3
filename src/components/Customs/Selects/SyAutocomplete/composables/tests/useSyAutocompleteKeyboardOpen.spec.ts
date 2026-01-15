import { describe, expect, it, vi } from 'vitest'
import { nextTick, ref, computed } from 'vue'

import { useSyAutocompleteKeyboardOpen } from '../useSyAutocompleteKeyboardOpen'

describe('useSyAutocompleteKeyboardOpen', () => {
	it('opens menu and focuses first option on ArrowDown when closed', async () => {
		const isOpen = ref(false)
		const openMenu = vi.fn(() => {
			isOpen.value = true
		})
		const setActiveDescendant = vi.fn()

		const { handleInputDownKey } = useSyAutocompleteKeyboardOpen({
			isOpen,
			activeDescendantId: ref(''),
			optionIdPrefix: computed(() => 'menu-'),
			formattedItemsLength: computed(() => 1),
			pendingFocusIndex: ref(null),
			openMenu,
			clearActiveDescendant: vi.fn(),
			setActiveDescendant,
			handleDownKey: vi.fn(),
			handleUpKey: vi.fn(),
			ensureFirstOptionFocused: () => setActiveDescendant(0),
		})

		handleInputDownKey()
		expect(openMenu).toHaveBeenCalled()
		await nextTick()
		expect(setActiveDescendant).toHaveBeenCalledWith(0)
	})
})
