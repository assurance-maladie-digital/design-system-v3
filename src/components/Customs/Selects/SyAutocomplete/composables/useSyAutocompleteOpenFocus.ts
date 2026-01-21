import { nextTick, watch, type Ref } from 'vue'

export interface UseSyAutocompleteOpenFocusOptions {
	isOpen: Ref<boolean>
	openedByTyping: Ref<boolean>
	activeDescendantId: Ref<string>
	setActiveDescendant: (index: number) => void
}

export function useSyAutocompleteOpenFocus(options: UseSyAutocompleteOpenFocusOptions) {
	watch(options.isOpen, (newValue) => {
		if (!newValue) {
			options.openedByTyping.value = false
		}
		if (newValue) {
			nextTick(() => {
				if (!options.openedByTyping.value && !options.activeDescendantId.value) {
					options.setActiveDescendant(0)
				}
				options.openedByTyping.value = false
			})
		}
	})
}
