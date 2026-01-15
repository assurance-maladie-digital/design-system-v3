import { describe, expect, it, vi } from 'vitest'
import { ref, defineComponent } from 'vue'
import { mount } from '@vue/test-utils'

import { useSyAutocompleteVuetifyAdapter } from '../useSyAutocompleteVuetifyAdapter'

vi.mock('../../../common/combobox/useSyComboboxVuetifyFocus', () => {
	return {
		useSyComboboxVuetifyFocus: () => ({
			getNativeInputElement: () => null,
			focusInputElement: vi.fn(),
			ensureNativeInputFocus: vi.fn(),
		}),
	}
})

describe('useSyAutocompleteVuetifyAdapter', () => {
	it('returns focus helpers and scrollActiveOptionIntoView function', () => {
		let api: unknown
		const TestComponent = defineComponent({
			setup() {
				api = useSyAutocompleteVuetifyAdapter({
					textInput: ref(null),
					list: ref(null),
					isOpen: ref(false),
					activeDescendantId: ref(''),
					onNativeInputKeydown: vi.fn(),
					onFieldRootKeydown: vi.fn(),
				})
				return () => null
			},
		})
		mount(TestComponent)

		expect(api).toHaveProperty('focusInputElement')
		expect(api).toHaveProperty('ensureNativeInputFocus')
		expect(api).toHaveProperty('scrollActiveOptionIntoView')
	})
})
