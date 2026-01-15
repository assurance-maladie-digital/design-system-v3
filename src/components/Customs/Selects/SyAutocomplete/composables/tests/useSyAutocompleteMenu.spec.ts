import { describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'

import { useSyAutocompleteMenu } from '../useSyAutocompleteMenu'

vi.mock('../../../common/combobox/useSyComboboxMenu', () => {
	return {
		useSyComboboxMenu: vi.fn((opts: { onOpen?: () => void }) => {
			return {
				openMenu: () => opts.onOpen?.(),
				closeMenu: vi.fn(),
				toggleMenu: vi.fn(),
				closeList: vi.fn(),
			}
		}),
	}
})

import { useSyComboboxMenu } from '../../../common/combobox/useSyComboboxMenu'

describe('useSyAutocompleteMenu', () => {
	it('calls scheduleFetch and ensureNativeInputFocus on open', () => {
		const scheduleFetch = vi.fn()
		const ensureNativeInputFocus = vi.fn()
		const searchValue = ref('abc')

		const { openMenu } = useSyAutocompleteMenu({
			readonly: ref(false),
			multiple: ref(false),
			isOpen: ref(false),
			list: ref(null),
			searchValue,
			ensureNativeInputFocus,
			scheduleFetch,
			setActiveDescendant: vi.fn(),
			openedByTyping: ref(false),
		})

		openMenu()
		expect(scheduleFetch).toHaveBeenCalledWith('abc')
		expect(ensureNativeInputFocus).toHaveBeenCalled()

		// contract: should delegate to combobox menu
		expect(vi.mocked(useSyComboboxMenu)).toHaveBeenCalledTimes(1)
	})
})
