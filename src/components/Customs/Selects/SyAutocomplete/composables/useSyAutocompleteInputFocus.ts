import { type Ref } from 'vue'

export interface UseSyAutocompleteInputFocusOptions {
	multiple: Ref<boolean>
	chips: Ref<boolean>
	isInputFocused: Ref<boolean>
	searchValue: Ref<string>
	markTouched: () => void
	ensureNativeInputFocus: () => void
}

export interface UseSyAutocompleteInputFocusResult {
	handleInputFocus: () => void
	handleInputBlur: () => void
}

export function useSyAutocompleteInputFocus(options: UseSyAutocompleteInputFocusOptions): UseSyAutocompleteInputFocusResult {
	const handleInputFocus = () => {
		options.isInputFocused.value = true
		options.ensureNativeInputFocus()
	}

	const handleInputBlur = () => {
		options.isInputFocused.value = false
		options.markTouched()
		if (options.multiple.value && !options.chips.value) {
			options.searchValue.value = ''
		}
	}

	return { handleInputFocus, handleInputBlur }
}
