import { describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'

import { useSyAutocompleteFetch } from '../useSyAutocompleteFetch'

describe('useSyAutocompleteFetch', () => {
	it('filters locally when fetchItems is not provided', async () => {
		const items = ref([
			{ text: 'France', value: 'FR' },
			{ text: 'Finlande', value: 'FI' },
			{ text: 'Allemagne', value: 'DE' },
		])

		const emitLoading = vi.fn()
		const emitError = vi.fn()

		const { internalItems, scheduleFetch } = useSyAutocompleteFetch({
			items,
			fetchItems: undefined,
			minChars: ref(1),
			debounceMs: ref(0),
			cache: ref(false),
			getItemText: it => (it as unknown as { text: string }).text,
			emitLoading,
			emitError,
		})

		await scheduleFetch('fr')
		expect(internalItems.value.map(i => (i as unknown as { value: string }).value)).toEqual(['FR'])
		expect(emitError).not.toHaveBeenCalled()
	})
})
