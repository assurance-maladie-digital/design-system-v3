import { describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'

import { useSySelectAria } from '../useSySelectAria'

const ariaSpy = vi.fn()
vi.mock('../../../common/combobox/useSyComboboxAria', () => {
	return {
		useSyComboboxAria: (opts: unknown) => ariaSpy(opts),
	}
})

describe('useSySelectAria', () => {
	it('delegates to useSyComboboxAria with ariaAutocomplete="none"', () => {
		const root = document.createElement('div')
		root.innerHTML = '<input />'
		const textInput = ref<{ $el?: HTMLElement } | null>({ $el: root })

		useSySelectAria({
			textInput,
			isOpen: ref(false),
			uniqueMenuId: ref('menu'),
			activeDescendantId: ref(''),
			isRequired: ref(false),
			hasError: ref(false),
			selectedItem: ref(null),
		})

		expect(ariaSpy).toHaveBeenCalledTimes(1)
		const args = ariaSpy.mock.calls[0]?.[0] as { ariaAutocomplete: string, getRootEl: () => HTMLElement | null }
		expect(args).toBeTruthy()
		expect(args.ariaAutocomplete).toBe('none')
		expect(args.getRootEl()).toBe(root)
	})
})
