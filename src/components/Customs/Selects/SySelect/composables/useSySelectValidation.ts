import { computed, ref, watch, type Ref } from 'vue'
import { useValidatable } from '@/composables/validation/useValidatable'

import {
	useSyComboboxHasSelection,
	useSyComboboxIsRequired,
	useSyComboboxValidateOnSubmit,
} from '../../common/combobox/useSyComboboxValidationBase'

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

	const { hasSelection } = useSyComboboxHasSelection({
		selectedItem: options.selectedItem,
	})

	const { isRequired } = useSyComboboxIsRequired({
		required: options.required,
		errorMessages: options.errorMessages,
		disableErrorHandling: options.disableErrorHandling,
		readonly: options.readonly,
		hasSelection,
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

	const { validateOnSubmit } = useSyComboboxValidateOnSubmit({
		readonly: options.readonly,
		disableErrorHandling: options.disableErrorHandling,
		errorMessages: options.errorMessages,
		isRequired,
		setHasError: (value) => {
			hasError.value = value
		},
	})

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
