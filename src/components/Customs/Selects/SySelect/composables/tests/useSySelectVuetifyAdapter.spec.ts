import { describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'

import { useSySelectVuetifyAdapter } from '../useSySelectVuetifyAdapter'

const focusSpy = vi.fn((opts: unknown) => {
	void opts
	return {
		getNativeInputElement: vi.fn(),
		focusInputElement: vi.fn(),
		ensureNativeInputFocus: vi.fn(),
	}
})
vi.mock('../../../common/combobox/useSyComboboxVuetifyFocus', () => {
	return {
		useSyComboboxVuetifyFocus: (opts: unknown) => focusSpy(opts),
	}
})

describe('useSySelectVuetifyAdapter', () => {
	it('forwards focus helpers from useSyComboboxVuetifyFocus', () => {
		const textInput = ref<{ $el?: HTMLElement } | null>(null)
		const api = useSySelectVuetifyAdapter({ textInput })

		expect(focusSpy).toHaveBeenCalledTimes(1)
		expect(api).toHaveProperty('getNativeInputElement')
		expect(api).toHaveProperty('focusInputElement')
		expect(api).toHaveProperty('ensureNativeInputFocus')
	})
})
