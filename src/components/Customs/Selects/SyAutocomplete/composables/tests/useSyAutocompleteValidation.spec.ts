import { describe, expect, it } from 'vitest'
import { ref } from 'vue'

import { useSyAutocompleteValidation } from '../useSyAutocompleteValidation'

describe('useSyAutocompleteValidation', () => {
	it('does not show required error until touched', () => {
		const selectedItem = ref<unknown>(null)
		const { computedHasError, markTouched } = useSyAutocompleteValidation({
			required: ref(true),
			errorMessages: ref([]),
			readonly: ref(false),
			disableErrorHandling: ref(false),
			multiple: ref(false),
			selectedItem,
		})

		expect(computedHasError.value).toBe(false)
		markTouched()
		expect(computedHasError.value).toBe(true)
	})
})
