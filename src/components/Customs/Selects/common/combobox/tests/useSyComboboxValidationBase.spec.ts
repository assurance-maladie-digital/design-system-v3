import { describe, expect, it, vi } from 'vitest'
import { computed, ref } from 'vue'

import {
	useSyComboboxHasSelection,
	useSyComboboxIsRequired,
	useSyComboboxValidateOnSubmit,
} from '../useSyComboboxValidationBase'

describe('useSyComboboxValidationBase', () => {
	it('hasSelection works for single and multiple', () => {
		const selectedItem = ref<unknown>(null)
		const multiple = ref(false)
		const { hasSelection } = useSyComboboxHasSelection({ selectedItem, multiple })
		expect(hasSelection.value).toBe(false)

		selectedItem.value = 'x'
		expect(hasSelection.value).toBe(true)

		multiple.value = true
		selectedItem.value = []
		expect(hasSelection.value).toBe(false)

		selectedItem.value = ['a']
		expect(hasSelection.value).toBe(true)
	})

	it('isRequired is true when required or errorMessages and no selection', () => {
		const required = ref(true)
		const errorMessages = ref<readonly string[]>([])
		const disableErrorHandling = ref(false)
		const readonly = ref(false)
		const hasSelection = computed(() => false)

		const { isRequired } = useSyComboboxIsRequired({
			required,
			errorMessages,
			disableErrorHandling,
			readonly,
			hasSelection,
		})

		expect(isRequired.value).toBe(true)

		required.value = false
		errorMessages.value = ['err']
		expect(isRequired.value).toBe(true)
	})

	it('validateOnSubmit sets error state based on required/errors', () => {
		const readonly = ref(false)
		const disableErrorHandling = ref(false)
		const errorMessages = ref<readonly string[]>([])
		const isRequired = computed(() => true)
		const setHasError = vi.fn()

		const { validateOnSubmit } = useSyComboboxValidateOnSubmit({
			readonly,
			disableErrorHandling,
			errorMessages,
			isRequired,
			setHasError,
		})

		expect(validateOnSubmit()).toBe(false)
		expect(setHasError).toHaveBeenCalledWith(true)
	})
})
