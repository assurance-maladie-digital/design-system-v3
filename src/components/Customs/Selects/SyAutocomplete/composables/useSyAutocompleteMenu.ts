import { nextTick, type Ref } from 'vue'

type UseSyAutocompleteMenuOptions = {
	readonly: Ref<boolean>
	multiple: Ref<boolean>
	isOpen: Ref<boolean>
	list: Ref<{ $el?: HTMLElement } | null>
	searchValue: Ref<string>
	ensureNativeInputFocus: () => void
	scheduleFetch: (query: string) => void
	setActiveDescendant: (index: number) => void
	openedByTyping: Ref<boolean>
}

export function useSyAutocompleteMenu(options: UseSyAutocompleteMenuOptions) {
	const openMenu = (skipInitialFocus = false) => {
		if (options.readonly.value) return
		if (options.isOpen.value) return
		options.isOpen.value = true
		options.scheduleFetch(options.searchValue.value)
		options.ensureNativeInputFocus()
		if (!skipInitialFocus) {
			nextTick(() => {
				options.setActiveDescendant(0)
			})
		}
	}

	const closeMenu = () => {
		options.isOpen.value = false
	}

	const toggleMenu = (skipInitialFocus = false) => {
		if (options.readonly.value) return
		if (options.isOpen.value) {
			closeMenu()
			return
		}
		openMenu(skipInitialFocus)
	}

	const closeList = (event?: Event) => {
		const target = event?.target as HTMLElement
		const listElement = options.list.value?.$el
		if (options.multiple.value && listElement && target && listElement.contains(target)) {
			return
		}
		closeMenu()
	}

	const markOpenedByTyping = (value: boolean) => {
		options.openedByTyping.value = value
	}

	return {
		openMenu,
		closeMenu,
		toggleMenu,
		closeList,
		markOpenedByTyping,
	}
}
