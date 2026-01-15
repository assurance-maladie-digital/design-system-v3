import { type Ref } from 'vue'

import { useSyComboboxMenu } from '../../common/combobox/useSyComboboxMenu'

export type ItemType = {
	[key: string]: unknown
}

export interface UseSySelectMenuOptions {
	readonly: Ref<boolean>
	multiple: Ref<boolean>
	isOpen: Ref<boolean>
	list: Ref<{ $el: HTMLElement } | null>
	formattedItems: Ref<ItemType[]>
	isItemSelected: (item: ItemType) => boolean
	setActiveDescendant: (index: number) => void
}

export function useSySelectMenu(options: UseSySelectMenuOptions) {
	const { toggleMenu, closeList } = useSyComboboxMenu({
		readonly: options.readonly,
		multiple: options.multiple,
		isOpen: options.isOpen,
		list: options.list as unknown as Ref<{ $el?: HTMLElement } | null>,
		setActiveDescendant: options.setActiveDescendant,
		getInitialActiveIndex: () => {
			const selectedIndex = options.formattedItems.value.findIndex(item => options.isItemSelected(item))
			return selectedIndex >= 0 ? selectedIndex : 0
		},
	})

	return {
		toggleMenu,
		closeList,
	}
}
