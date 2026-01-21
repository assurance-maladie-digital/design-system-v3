import { computed, type ComputedRef, type Ref } from 'vue'

export interface UseSyAutocompleteMessagesOptions {
	disableErrorHandling: Ref<boolean>
	hideMessages: Ref<boolean>
	helpText: Ref<string>
	errorMessages: ComputedRef<readonly string[]>
	hasError: Ref<boolean>
}

export interface UseSyAutocompleteMessagesResult {
	hasMessages: ComputedRef<boolean>
	showHelpTextAsMessage: ComputedRef<boolean | ''>
	showHelpTextBelow: ComputedRef<boolean | ''>
}

export function useSyAutocompleteMessages(options: UseSyAutocompleteMessagesOptions): UseSyAutocompleteMessagesResult {
	const hasMessages = computed(() => {
		if (options.disableErrorHandling.value) return false
		return options.errorMessages.value.length > 0 || options.hasError.value
	})

	const showHelpTextAsMessage = computed(() => {
		return options.helpText.value && !hasMessages.value
	})

	const showHelpTextBelow = computed(() => {
		return options.helpText.value && hasMessages.value && !options.hideMessages.value
	})

	return {
		hasMessages,
		showHelpTextAsMessage,
		showHelpTextBelow,
	}
}
