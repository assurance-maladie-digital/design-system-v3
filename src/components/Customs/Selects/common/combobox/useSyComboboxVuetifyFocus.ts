import { nextTick, type Ref } from 'vue'

type UseSyComboboxVuetifyFocusOptions = {
	textInput: Ref<{ $el?: HTMLElement } | null>
}

export function useSyComboboxVuetifyFocus(options: UseSyComboboxVuetifyFocusOptions) {
	const getNativeInputElement = () => {
		return (options.textInput.value?.$el?.querySelector('input') as HTMLInputElement | null) ?? null
	}

	const focusInputElement = () => {
		getNativeInputElement()?.focus()
	}

	const ensureNativeInputFocus = () => {
		focusInputElement()
		nextTick(() => {
			focusInputElement()
			requestAnimationFrame(() => {
				focusInputElement()
				setTimeout(() => {
					focusInputElement()
				}, 0)
			})
		})
	}

	return {
		getNativeInputElement,
		focusInputElement,
		ensureNativeInputFocus,
	}
}
