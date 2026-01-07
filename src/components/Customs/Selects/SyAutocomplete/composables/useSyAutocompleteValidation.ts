import { computed, ref, type Ref } from 'vue'

type UseSyAutocompleteValidationOptions = {
	required: Ref<boolean>
	errorMessages: Ref<readonly string[]>
	readonly: Ref<boolean>
	disableErrorHandling: Ref<boolean>
	multiple: Ref<boolean>
	selectedItem: Ref<unknown>
}

export function useSyAutocompleteValidation(options: UseSyAutocompleteValidationOptions) {
	const hasError = ref(false)
	const isTouched = ref(false)

	const requiredErrorMessage = computed(() => 'Le champ est requis.')

	const isRequired = computed(() => {
		if (options.disableErrorHandling.value) return false
		if (options.readonly.value) return false

		if (options.multiple.value) {
			const selected = options.selectedItem.value as unknown[] | null | undefined
			return (options.required.value || options.errorMessages.value.length > 0)
				&& (!selected || selected.length === 0)
		}

		return (options.required.value || options.errorMessages.value.length > 0) && !options.selectedItem.value
	})

	const computedHasError = computed(() => {
		if (options.disableErrorHandling.value || options.readonly.value) return false
		if (options.errorMessages.value.length > 0) return true
		return Boolean(isTouched.value && isRequired.value)
	})

	const computedErrorMessages = computed(() => {
		if (options.disableErrorHandling.value) return []
		if (options.errorMessages.value.length > 0) return options.errorMessages.value
		return computedHasError.value ? [requiredErrorMessage.value] : []
	})

	const textFieldErrorMessages = computed(() => {
		return computedErrorMessages.value.length > 0 ? computedErrorMessages.value : undefined
	})

	const requiredRules = computed(() => {
		if (options.disableErrorHandling.value || options.readonly.value) return []
		if (!(options.required.value || options.errorMessages.value.length > 0)) return []
		return [() => (!isRequired.value || requiredErrorMessage.value)]
	})

	const markTouched = () => {
		isTouched.value = true
		hasError.value = computedHasError.value
	}

	const validateOnSubmit = (): boolean => {
		if (options.readonly.value || options.disableErrorHandling.value) {
			return true
		}

		isTouched.value = true
		const isValid = !isRequired.value
		hasError.value = !isValid || options.errorMessages.value.length > 0
		return isValid
	}

	return {
		hasError,
		isTouched,
		isRequired,
		requiredErrorMessage,
		computedHasError,
		computedErrorMessages,
		textFieldErrorMessages,
		requiredRules,
		markTouched,
		validateOnSubmit,
	}
}
