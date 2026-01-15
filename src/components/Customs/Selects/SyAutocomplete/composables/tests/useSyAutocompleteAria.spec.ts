import { describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'

import { useSyAutocompleteAria } from '../useSyAutocompleteAria'

const ariaSpy = vi.fn()
vi.mock('../../../common/combobox/useSyComboboxAria', () => {
	return {
		useSyComboboxAria: (opts: unknown) => ariaSpy(opts),
	}
})

describe('useSyAutocompleteAria', () => {
	it('delegates to useSyComboboxAria with ariaAutocomplete="list"', () => {
		const root = document.createElement('div')
		root.innerHTML = '<input />'
		const textInput = ref<{ $el?: HTMLElement } | null>({ $el: root })

		useSyAutocompleteAria({
			textInput,
			isOpen: ref(false),
			uniqueMenuId: ref('menu'),
			activeDescendantId: ref(''),
			isRequired: ref(false),
			hasError: ref(false),
			selectedItem: ref(null),
		})

		expect(ariaSpy).toHaveBeenCalledTimes(1)
		const args = ariaSpy.mock.calls[0]?.[0] as { ariaAutocomplete: string }
		expect(args).toBeTruthy()
		expect(args.ariaAutocomplete).toBe('list')
	})
})
