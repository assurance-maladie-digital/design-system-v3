import { nextTick, type Ref } from 'vue'

type UseSyComboboxMenuOptions = {
	readonly: Ref<boolean>
	multiple: Ref<boolean>
	isOpen: Ref<boolean>
	list: Ref<{ $el?: HTMLElement } | null>
	setActiveDescendant: (index: number) => void
	getInitialActiveIndex: () => number
	onOpen?: () => void
	onClose?: () => void
}

export function useSyComboboxMenu(options: UseSyComboboxMenuOptions) {
	const openMenu = (skipInitialFocus = false) => {
		if (options.readonly.value) return
		if (options.isOpen.value) return

		options.isOpen.value = true
		options.onOpen?.()

		if (!skipInitialFocus) {
			nextTick(() => {
				options.setActiveDescendant(options.getInitialActiveIndex())
			})
		}
	}

	const closeMenu = () => {
		if (!options.isOpen.value) return
		options.isOpen.value = false
		options.onClose?.()
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

	return {
		openMenu,
		closeMenu,
		toggleMenu,
		closeList,
	}
}
