import { ref, nextTick, onBeforeUnmount, onMounted, watch, watchEffect, type Ref } from 'vue'

import { useSyComboboxVuetifyFocus } from '../../common/combobox/useSyComboboxVuetifyFocus'

type UseSyAutocompleteVuetifyAdapterOptions = {
	textInput: Ref<{ $el?: HTMLElement } | null>
	list: Ref<{ $el?: HTMLElement } | null>
	isOpen: Ref<boolean>
	activeDescendantId: Ref<string>
	onNativeInputKeydown: (event: KeyboardEvent) => void
	onFieldRootKeydown: (event: KeyboardEvent) => void
}

export function useSyAutocompleteVuetifyAdapter(options: UseSyAutocompleteVuetifyAdapterOptions) {
	const nativeInputEl = ref<HTMLInputElement | null>(null)
	const fieldRootEl = ref<HTMLElement | null>(null)

	const { getNativeInputElement, focusInputElement, ensureNativeInputFocus } = useSyComboboxVuetifyFocus({
		textInput: options.textInput,
	})

	const getFieldRootElement = () => {
		return (options.textInput.value?.$el as HTMLElement | undefined) ?? null
	}

	const escapeForSelector = (value: string) => {
		const maybeCss = (globalThis as unknown as { CSS?: { escape?: (s: string) => string } }).CSS
		if (typeof maybeCss?.escape === 'function') {
			return maybeCss.escape(value)
		}
		return String(value).replace(/[^a-zA-Z0-9_-]/g, c => `\\${c}`)
	}

	const scrollActiveOptionIntoView = () => {
		if (!options.activeDescendantId.value) return
		nextTick(() => {
			const listElement = options.list.value?.$el as HTMLElement | undefined
			if (!listElement) return

			const element = listElement.querySelector(`#${escapeForSelector(options.activeDescendantId.value)}`)
			if (!element) return

			// On garde le focus DOM sur l'input (pattern combobox). On scroll uniquement l'option active.
			;(element as HTMLElement).scrollIntoView({ block: 'nearest' })
		})
	}

	const attachNativeKeydownListener = () => {
		const el = getNativeInputElement()
		if (!el) return
		if (nativeInputEl.value === el) return

		if (nativeInputEl.value) {
			nativeInputEl.value.removeEventListener('keydown', options.onNativeInputKeydown, true)
		}
		nativeInputEl.value = el
		nativeInputEl.value.addEventListener('keydown', options.onNativeInputKeydown, true)
	}

	const attachFieldRootKeydownListener = () => {
		const el = getFieldRootElement()
		if (!el) return
		if (fieldRootEl.value === el) return

		if (fieldRootEl.value) {
			fieldRootEl.value.removeEventListener('keydown', options.onFieldRootKeydown, true)
		}
		fieldRootEl.value = el
		fieldRootEl.value.addEventListener('keydown', options.onFieldRootKeydown, true)
	}

	const detachNativeKeydownListener = () => {
		if (!nativeInputEl.value) return
		nativeInputEl.value.removeEventListener('keydown', options.onNativeInputKeydown, true)
		nativeInputEl.value = null
	}

	const detachFieldRootKeydownListener = () => {
		if (!fieldRootEl.value) return
		fieldRootEl.value.removeEventListener('keydown', options.onFieldRootKeydown, true)
		fieldRootEl.value = null
	}

	onMounted(() => {
		nextTick(() => {
			attachNativeKeydownListener()
			attachFieldRootKeydownListener()
		})
	})

	watchEffect(() => {
		// Quand l'instance VTextField (activateur) change, on rattache les listeners.
		void options.textInput.value
		nextTick(() => {
			attachNativeKeydownListener()
			attachFieldRootKeydownListener()
		})
	})

	watch(options.isOpen, (newValue) => {
		if (newValue) {
			ensureNativeInputFocus()
		}
	})

	watch(options.activeDescendantId, (newValue) => {
		nextTick(() => {
			if (!options.textInput.value || !options.textInput.value.$el || !options.isOpen.value) return
			if (newValue) {
				scrollActiveOptionIntoView()
			}
		})
	})

	onBeforeUnmount(() => {
		detachNativeKeydownListener()
		detachFieldRootKeydownListener()
	})

	return {
		focusInputElement,
		ensureNativeInputFocus,
		scrollActiveOptionIntoView,
	}
}
