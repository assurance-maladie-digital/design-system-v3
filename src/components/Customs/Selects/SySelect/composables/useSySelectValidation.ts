import { computed, ref, watch, type Ref } from 'vue'
import { useValidatable } from '@/composables/validation/useValidatable'

export interface UseSySelectValidationOptions {
	isOpen: Ref<boolean>
	selectedItem: Ref<unknown>
	disableErrorHandling: Ref<boolean>
	readonly: Ref<boolean>
	required: Ref<boolean>
	errorMessages: Ref<readonly string[]>
	helpText: Ref<string>
	hideMessages: Ref<boolean>
}

export function useSySelectValidation(options: UseSySelectValidationOptions) {
	const hasError = ref(false)

	const hasSelection = computed(() => {
		const value = options.selectedItem.value
		if (Array.isArray(value)) {
			return value.length > 0
		}
		return Boolean(value)
	})

	const isRequired = computed(() => {
		if (options.disableErrorHandling.value) return false
		if (options.readonly.value) return
		return (options.required.value || options.errorMessages.value.length > 0) && !hasSelection.value
	})

	const hasMessages = computed(() => {
		if (options.disableErrorHandling.value) return false
		return options.errorMessages.value.length > 0 || hasError.value
	})

	const showHelpTextAsMessage = computed(() => {
		return options.helpText.value && !hasMessages.value
	})

	const showHelpTextBelow = computed(() => {
		return options.helpText.value && hasMessages.value && !options.hideMessages.value
	})

	watch([options.isOpen, hasError], ([newIsOpen, newHasError]) => {
		if (!newIsOpen) {
			if (options.disableErrorHandling.value || options.readonly.value) {
				hasError.value = false
			}
			else {
				hasError.value = (!options.selectedItem.value && isRequired.value) || options.errorMessages.value.length > 0
			}
		}
		else {
			hasError.value = newHasError
		}
	})

	watch(options.errorMessages, (newValue) => {
		if (!options.disableErrorHandling.value) {
			hasError.value = newValue.length > 0
		}
	})

	const validateOnSubmit = (): boolean => {
		if (options.readonly.value || options.disableErrorHandling.value) {
			return true
		}

		const isValid = !isRequired.value
		hasError.value = !isValid || options.errorMessages.value.length > 0
		return isValid
	}

	const clearValidation = () => {
		hasError.value = false
	}

	const reset = () => {
		hasError.value = false
	}

	useValidatable(validateOnSubmit, clearValidation, reset)

	return {
		hasError,
		isRequired,
		hasMessages,
		showHelpTextAsMessage,
		showHelpTextBelow,
		validateOnSubmit,
		clearValidation,
		reset,
	}
}
