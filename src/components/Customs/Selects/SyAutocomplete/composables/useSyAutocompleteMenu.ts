import { type Ref } from 'vue'

import { useSyComboboxMenu } from '../../common/combobox/useSyComboboxMenu'

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
	const {
		openMenu,
		closeMenu,
		toggleMenu,
		closeList,
	} = useSyComboboxMenu({
		readonly: options.readonly,
		multiple: options.multiple,
		isOpen: options.isOpen,
		list: options.list,
		setActiveDescendant: options.setActiveDescendant,
		getInitialActiveIndex: () => 0,
		onOpen: () => {
			options.scheduleFetch(options.searchValue.value)
			options.ensureNativeInputFocus()
		},
	})

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
