import { nextTick, type Ref } from 'vue'

import type { SelectItemArrayType, SelectItemValueType } from '../types'

type UseSyAutocompleteKeydownOptions = {
	textInput: Ref<{ $el?: HTMLElement } | null>
	isOpen: Ref<boolean>
	multiple: Ref<boolean>
	selectedItem: Ref<SelectItemValueType | SelectItemArrayType>
	searchValue: Ref<string>
	handleTabKey: () => void
	handleInputDownKey: () => void
	handleInputUpKey: () => void
	handleListDownKey: () => void
	handleListUpKey: () => void
	handleListEscapeKey: () => void
	handleHomeKey: () => void
	handleEndKey: () => void
	handlePageUpKey: () => void
	handlePageDownKey: () => void
	handleEnterKey: () => void
	handleSpaceKey: () => void
	handleEscapeKey: () => void
	removeChip: (item: unknown) => void
	focusInputElement: () => void
	ensureNativeInputFocus: () => void
}

export function useSyAutocompleteKeydown(options: UseSyAutocompleteKeydownOptions) {
	const getNativeInputElement = () => {
		return (options.textInput.value?.$el?.querySelector('input') as HTMLInputElement | null) ?? null
	}

	const onNativeInputKeydown = (event: KeyboardEvent) => {
		if (event.key === 'ArrowDown') {
			event.preventDefault()
			event.stopPropagation()
			;(event as unknown as { stopImmediatePropagation?: () => void }).stopImmediatePropagation?.()
			options.handleInputDownKey()
			return
		}
		if (event.key === 'ArrowUp') {
			event.preventDefault()
			event.stopPropagation()
			;(event as unknown as { stopImmediatePropagation?: () => void }).stopImmediatePropagation?.()
			options.handleInputUpKey()
			return
		}

		if (
			event.key === 'Backspace'
			&& options.multiple.value
			&& Array.isArray(options.selectedItem.value)
			&& options.selectedItem.value.length > 0
			&& options.searchValue.value.trim().length === 0
		) {
			event.preventDefault()
			const last = options.selectedItem.value[options.selectedItem.value.length - 1]
			options.removeChip(last)
			nextTick(() => {
				options.focusInputElement()
			})
			return
		}

		switch (event.key) {
			case 'Home':
				event.preventDefault()
				options.handleHomeKey()
				break
			case 'End':
				event.preventDefault()
				options.handleEndKey()
				break
			case 'PageUp':
				event.preventDefault()
				options.handlePageUpKey()
				break
			case 'PageDown':
				event.preventDefault()
				options.handlePageDownKey()
				break
			case 'Tab':
				options.handleTabKey()
				break
			case 'Enter':
				event.preventDefault()
				event.stopPropagation()
				;(event as unknown as { stopImmediatePropagation?: () => void }).stopImmediatePropagation?.()
				options.handleEnterKey()
				break
			case ' ':
			case 'Spacebar':
				event.preventDefault()
				event.stopPropagation()
				;(event as unknown as { stopImmediatePropagation?: () => void }).stopImmediatePropagation?.()
				options.handleSpaceKey()
				break
			case 'Escape':
				event.preventDefault()
				options.handleEscapeKey()
				nextTick(() => {
					options.focusInputElement()
				})
				break
			default:
				break
		}
	}

	const onListKeydown = (event: KeyboardEvent) => {
		switch (event.key) {
			case 'Escape':
				event.preventDefault()
				options.handleListEscapeKey()
				break
			case 'Tab':
				options.handleTabKey()
				break
			case 'Enter':
				event.preventDefault()
				options.handleEnterKey()
				break
			case 'ArrowDown':
				event.preventDefault()
				options.handleListDownKey()
				break
			case 'ArrowUp':
				event.preventDefault()
				options.handleListUpKey()
				break
			case 'Home':
				event.preventDefault()
				options.handleHomeKey()
				break
			case 'End':
				event.preventDefault()
				options.handleEndKey()
				break
			case 'PageUp':
				event.preventDefault()
				options.handlePageUpKey()
				break
			case 'PageDown':
				event.preventDefault()
				options.handlePageDownKey()
				break
			default:
				break
		}
	}

	const onFieldRootKeydown = (event: KeyboardEvent) => {
		const input = getNativeInputElement()
		if (input && event.target === input) return

		if (event.key === 'ArrowDown') {
			event.preventDefault()
			event.stopPropagation()
			;(event as unknown as { stopImmediatePropagation?: () => void }).stopImmediatePropagation?.()
			options.handleInputDownKey()
			options.ensureNativeInputFocus()
			return
		}
		if (event.key === 'ArrowUp') {
			event.preventDefault()
			event.stopPropagation()
			;(event as unknown as { stopImmediatePropagation?: () => void }).stopImmediatePropagation?.()
			options.handleInputUpKey()
			options.ensureNativeInputFocus()
			return
		}

		if (!options.isOpen.value) return

		switch (event.key) {
			case 'Enter':
				event.preventDefault()
				event.stopPropagation()
				;(event as unknown as { stopImmediatePropagation?: () => void }).stopImmediatePropagation?.()
				options.handleEnterKey()
				options.ensureNativeInputFocus()
				break
			case ' ':
			case 'Spacebar':
				event.preventDefault()
				event.stopPropagation()
				;(event as unknown as { stopImmediatePropagation?: () => void }).stopImmediatePropagation?.()
				options.handleSpaceKey()
				options.ensureNativeInputFocus()
				break
			case 'Escape':
				event.preventDefault()
				options.handleEscapeKey()
				nextTick(() => {
					options.focusInputElement()
				})
				break
			default:
				break
		}
	}

	return {
		onNativeInputKeydown,
		onFieldRootKeydown,
		onListKeydown,
	}
}
