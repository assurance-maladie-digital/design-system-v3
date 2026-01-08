import { computed, nextTick, type Ref } from 'vue'

export type ItemType = {
	[key: string]: unknown
}

export type SelectItemValueType = Record<string, unknown> | string | number | null | undefined
export type SelectItemArrayType = Array<Record<string, unknown> | string | number>

export interface UseSySelectSelectionOptions {
	items: Ref<ItemType[]>
	formattedItems: Ref<ItemType[]>
	selectedItem: Ref<SelectItemValueType | SelectItemArrayType>
	multiple: Ref<boolean>
	chips: Ref<boolean>
	returnObject: Ref<boolean>
	textKey: Ref<string>
	plainTextKey: Ref<string>
	valueKey: Ref<string>
	allowHtml: Ref<boolean>
	isOpen: Ref<boolean>
	ensureNativeInputFocus: () => void
	setActiveDescendant: (index: number) => void
	restoreFocus: () => void
	emitUpdateModelValue: (value: unknown) => void
}

export function useSySelectSelection(options: UseSySelectSelectionOptions) {
	const isDefaultOption = (item: ItemType) => {
		const itemText = item[options.textKey.value] as string
		return itemText.includes('-') && (itemText.includes('choisir') || itemText.includes('sélectionner'))
	}

	const isItemSelected = (item: ItemType) => {
		if (options.multiple.value && isDefaultOption(item)) {
			return !options.selectedItem.value || (Array.isArray(options.selectedItem.value) && options.selectedItem.value.length === 0)
		}

		if (!options.selectedItem.value) return false

		if (options.multiple.value && Array.isArray(options.selectedItem.value)) {
			return options.selectedItem.value.some((selected) => {
				if (options.returnObject.value) {
					return (selected as Record<string, unknown> | null | undefined)?.[options.valueKey.value] === item?.[options.valueKey.value]
				}
				return selected === item?.[options.valueKey.value]
			})
		}

		if (options.returnObject.value) {
			return Boolean(
				options.selectedItem.value
				&& (options.selectedItem.value as Record<string, unknown>)[options.valueKey.value] === item?.[options.valueKey.value],
			)
		}

		return options.selectedItem.value === item?.[options.valueKey.value]
	}

	const getItemText = (item: unknown) => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any -- generic type
		return (item as Record<string, any>)[options.textKey.value]
	}

	const getPlainItemText = (item: unknown) => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any -- generic type
		const itemObj = item as Record<string, any>
		if (options.plainTextKey.value && options.allowHtml.value && itemObj[options.plainTextKey.value]) {
			return itemObj[options.plainTextKey.value]
		}
		return itemObj[options.textKey.value]
	}

	const safeChipItem = (item: unknown): Record<string, unknown> | string | number => {
		if (item === null || item === undefined) return ''
		if (typeof item === 'string' || typeof item === 'number') return item
		if (typeof item === 'object') return item as Record<string, unknown>
		return String(item)
	}

	const getChipText = (item: unknown) => {
		const safeItem = safeChipItem(item)

		if (typeof safeItem === 'object') {
			return (safeItem as Record<string, unknown>)[options.textKey.value] as string
		}

		return (
			options.items.value.find((i: ItemType) => i[options.valueKey.value] === safeItem)?.[options.textKey.value] as string
		) || ''
	}

	const removeChip = (item: unknown) => {
		if (!Array.isArray(options.selectedItem.value)) return

		const selectedArray = [...options.selectedItem.value]
		const safeItem = safeChipItem(item)
		let index: number

		if (options.returnObject.value) {
			const itemValue = typeof safeItem === 'object'
				? (safeItem as Record<string, unknown>)[options.valueKey.value]
				: safeItem
			index = selectedArray.findIndex(selected =>
				(selected as Record<string, unknown>)[options.valueKey.value] === itemValue)
		}
		else {
			index = selectedArray.indexOf(safeItem)
		}

		if (index > -1) {
			selectedArray.splice(index, 1)
			const updatedArray = [...selectedArray]
			options.selectedItem.value = updatedArray
			options.emitUpdateModelValue(updatedArray)
		}
	}

	const hasChips = computed(() => {
		return options.chips.value && options.multiple.value && Array.isArray(options.selectedItem.value) && options.selectedItem.value.length > 0
	})

	const selectedChipsItems = computed(() => {
		return Array.isArray(options.selectedItem.value) ? options.selectedItem.value : []
	})

	const hasSelectionToClear = computed(() => {
		return options.multiple.value
			? (((options.selectedItem.value as unknown[] | null | undefined)?.length) ?? 0) > 0
			: options.selectedItem.value != null
	})

	const selectedItemText = computed(() => {
		if (hasChips.value) {
			return ''
		}

		if (options.multiple.value) {
			if (!options.selectedItem.value || (Array.isArray(options.selectedItem.value) && options.selectedItem.value.length === 0)) {
				const defaultOption = options.items.value.find(item => isDefaultOption(item))
				if (defaultOption) {
					return getPlainItemText(defaultOption) as string
				}
				return ''
			}

			const selectedArray = options.selectedItem.value as SelectItemArrayType
			return selectedArray.map((selected) => {
				if (options.returnObject.value) {
					return getPlainItemText(selected)
				}
				const foundItem = options.items.value.find((item: ItemType) => item[options.valueKey.value] === selected)
				return foundItem ? getPlainItemText(foundItem) : ''
			}).join(', ')
		}

		if (!options.selectedItem.value) return ''

		if (options.returnObject.value) {
			return getPlainItemText(options.selectedItem.value)
		}

		const foundItem = options.items.value.find(item => item[options.valueKey.value] === options.selectedItem.value)
		return foundItem ? getPlainItemText(foundItem) : ''
	})

	const selectItem = (item: ItemType | null, event?: Event) => {
		event?.preventDefault()
		event?.stopPropagation()

		if (event?.type === 'click' && item !== null) {
			const clickedIndex = options.formattedItems.value.findIndex((formattedItem) => {
				if (options.returnObject.value) {
					return formattedItem[options.valueKey.value] === item[options.valueKey.value]
				}
				return formattedItem === item
			})

			if (clickedIndex !== -1) {
				options.setActiveDescendant(clickedIndex)
			}
		}

		if (item === null) {
			options.selectedItem.value = options.multiple.value ? [] : null
			options.emitUpdateModelValue(options.multiple.value ? [] : null)

			if (event?.type === 'keydown' || event?.type === 'click') {
				if (!options.isOpen.value) {
					options.isOpen.value = true
				}

				nextTick(() => {
					options.ensureNativeInputFocus()
					options.restoreFocus()
				})
			}
			else {
				options.isOpen.value = false
			}
			return
		}

		if (options.multiple.value && isDefaultOption(item)) {
			options.selectedItem.value = []
			options.emitUpdateModelValue([])
			options.isOpen.value = false
			return
		}

		if (isDefaultOption(item)) {
			return
		}

		if (options.multiple.value) {
			if (!Array.isArray(options.selectedItem.value)) {
				options.selectedItem.value = []
			}

			const selectedArray = options.selectedItem.value as SelectItemArrayType
			let valueToCheck: unknown
			let valueToStore: Record<string, unknown> | string | number

			if (options.returnObject.value) {
				valueToCheck = item[options.valueKey.value]
				valueToStore = item
			}
			else {
				valueToCheck = item[options.valueKey.value]
				valueToStore = item[options.valueKey.value] as string | number | Record<string, unknown>
			}

			const index = selectedArray.findIndex((selected) => {
				if (options.returnObject.value) {
					return (selected as Record<string, unknown>)[options.valueKey.value] === valueToCheck
				}
				return selected === valueToCheck
			})

			if (index > -1) {
				selectedArray.splice(index, 1)
			}
			else {
				selectedArray.push(valueToStore)
			}

			options.emitUpdateModelValue([...selectedArray])
			options.isOpen.value = true
			return
		}

		if (options.returnObject.value) {
			options.selectedItem.value = item
			options.emitUpdateModelValue(item)
		}
		else {
			options.selectedItem.value = item[options.valueKey.value] as SelectItemValueType
			options.emitUpdateModelValue(item[options.valueKey.value] as SelectItemValueType)
		}

		options.isOpen.value = false
	}

	return {
		isDefaultOption,
		isItemSelected,
		selectItem,
		removeChip,
		getItemText,
		getPlainItemText,
		safeChipItem,
		getChipText,
		hasChips,
		selectedChipsItems,
		hasSelectionToClear,
		selectedItemText,
	}
}
