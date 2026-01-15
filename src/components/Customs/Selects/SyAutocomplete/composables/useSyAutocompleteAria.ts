import { type Ref } from 'vue'

import { useSyComboboxAria } from '../../common/combobox/useSyComboboxAria'

type UseSyAutocompleteAriaOptions = {
	textInput: Ref<{ $el?: HTMLElement } | null>
	isOpen: Ref<boolean>
	uniqueMenuId: Ref<string>
	activeDescendantId: Ref<string>
	isRequired: Ref<boolean>
	hasError: Ref<boolean>
	selectedItem: Ref<unknown>
}

export function useSyAutocompleteAria(options: UseSyAutocompleteAriaOptions) {
	return useSyComboboxAria({
		getRootEl: () => options.textInput.value?.$el ?? null,
		getInputEl: rootEl => rootEl.querySelector('input') as HTMLElement,
		isOpen: options.isOpen,
		uniqueMenuId: options.uniqueMenuId,
		activeDescendantId: options.activeDescendantId,
		isRequired: options.isRequired,
		hasError: options.hasError,
		selectedItem: options.selectedItem,
	})
}
