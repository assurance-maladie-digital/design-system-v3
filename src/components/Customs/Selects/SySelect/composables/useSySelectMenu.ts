import { nextTick, type Ref } from 'vue'

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
	const toggleMenu = (skipInitialFocus = false) => {
		if (options.readonly.value) return

		options.isOpen.value = !options.isOpen.value

		if (options.isOpen.value && !skipInitialFocus) {
			nextTick(() => {
				const selectedIndex = options.formattedItems.value.findIndex(item => options.isItemSelected(item))
				if (selectedIndex >= 0) {
					options.setActiveDescendant(selectedIndex)
				}
				else {
					options.setActiveDescendant(0)
				}
			})
		}
	}

	const closeList = (event?: Event) => {
		const target = event?.target as HTMLElement
		const listElement = options.list.value?.$el

		if (options.multiple.value && listElement && target && listElement.contains(target)) {
			return
		}

		options.isOpen.value = false
	}

	return {
		toggleMenu,
		closeList,
	}
}
