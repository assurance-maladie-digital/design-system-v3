import type { Ref } from 'vue'

import { useSyComboboxVuetifyFocus } from '../../common/combobox/useSyComboboxVuetifyFocus'

export interface UseSySelectVuetifyAdapterOptions {
	textInput: Ref<{ $el: HTMLElement } | null>
}

export function useSySelectVuetifyAdapter(options: UseSySelectVuetifyAdapterOptions) {
	const { getNativeInputElement, focusInputElement, ensureNativeInputFocus } = useSyComboboxVuetifyFocus({
		textInput: options.textInput,
	})

	return {
		getNativeInputElement,
		focusInputElement,
		ensureNativeInputFocus,
	}
}
