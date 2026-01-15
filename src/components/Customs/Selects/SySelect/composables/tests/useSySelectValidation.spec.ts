import { describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'

import { useSySelectValidation } from '../useSySelectValidation'

vi.mock('@/composables/validation/useValidatable', () => {
	return { useValidatable: () => {} }
})

describe('useSySelectValidation', () => {
	it('sets hasError when menu closes on required empty selection', async () => {
		const isOpen = ref(true)
		const selectedItem = ref<unknown>(null)

		const { hasError } = useSySelectValidation({
			isOpen,
			selectedItem,
			disableErrorHandling: ref(false),
			readonly: ref(false),
			required: ref(true),
			errorMessages: ref([]),
			helpText: ref(''),
			hideMessages: ref(false),
		})

		expect(hasError.value).toBe(false)
		isOpen.value = false
		await nextTick()
		expect(hasError.value).toBe(true)
	})
})
