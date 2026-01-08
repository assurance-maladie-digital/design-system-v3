import { computed, type Ref } from 'vue'

import type { ItemType, SelectItemArrayType, SelectItemValueType } from '../types'

type UseSyAutocompleteSelectionOptions = {
	multiple: Ref<boolean>
	chips: Ref<boolean>
	returnObject: Ref<boolean>
	textKey: Ref<string>
	valueKey: Ref<string>
	plainTextKey: Ref<string | undefined>
	allowHtml: Ref<boolean>
	internalItems: Ref<ItemType[]>
	selectedItem: Ref<SelectItemValueType | SelectItemArrayType>
	searchValue: Ref<string>
	isOpen: Ref<boolean>
	markTouched: () => void
	updateHasError: () => void
	ensureNativeInputFocus: () => void
	emitUpdateModelValue: (value: SelectItemValueType | SelectItemArrayType) => void
	emitUpdateSearch: (value: string) => void
}

export function useSyAutocompleteSelection(options: UseSyAutocompleteSelectionOptions) {
	const hasChips = computed(() => {
		return options.chips.value
			&& options.multiple.value
			&& Array.isArray(options.selectedItem.value)
			&& options.selectedItem.value.length > 0
	})

	const getPlainItemText = (item: unknown) => {
		const itemObj = item as Record<string, unknown>
		if (options.plainTextKey.value && options.allowHtml.value && itemObj[options.plainTextKey.value]) {
			return itemObj[options.plainTextKey.value] as string
		}
		return itemObj[options.textKey.value] as string
	}

	const getItemText = (item: unknown) => {
		return (item as Record<string, unknown>)[options.textKey.value] as string
	}

	const isItemSelected = (item: ItemType) => {
		if (!options.selectedItem.value) return false

		if (options.multiple.value && Array.isArray(options.selectedItem.value)) {
			return options.selectedItem.value.some((selected) => {
				if (options.returnObject.value) {
					return (selected as Record<string, unknown>)?.[options.valueKey.value] === item?.[options.valueKey.value]
				}
				return selected === item?.[options.valueKey.value]
			})
		}

		if (options.returnObject.value) {
			return Boolean((options.selectedItem.value as Record<string, unknown>)?.[options.valueKey.value] === item?.[options.valueKey.value])
		}

		return options.selectedItem.value === item?.[options.valueKey.value]
	}

	const getChipText = (item: unknown) => {
		if (typeof item === 'object' && item) {
			return (item as Record<string, unknown>)[options.textKey.value] as string
		}

		return options.internalItems.value.find((i: ItemType) => i[options.valueKey.value] === item)?.[options.textKey.value] as string || ''
	}

	const getChipKey = (item: unknown) => {
		if (options.returnObject.value && typeof item === 'object' && item) {
			const key = (item as Record<string, unknown>)[options.valueKey.value]
			return (typeof key === 'string' || typeof key === 'number') ? key : String(key)
		}
		return (typeof item === 'string' || typeof item === 'number') ? item : String(item)
	}

	const getMultipleSelectionText = () => {
		if (!options.multiple.value || options.chips.value) return ''
		if (!Array.isArray(options.selectedItem.value) || options.selectedItem.value.length === 0) return ''
		return options.selectedItem.value.map(item => getChipText(item)).filter(Boolean).join(', ')
	}

	const removeChip = (item: unknown) => {
		if (!Array.isArray(options.selectedItem.value)) return
		const selectedArray = [...options.selectedItem.value]

		let index = -1
		if (options.returnObject.value) {
			const itemValue = (item as Record<string, unknown> | null)?.[options.valueKey.value]
			index = selectedArray.findIndex(selected =>
				(selected as Record<string, unknown>)?.[options.valueKey.value] === itemValue,
			)
		}
		else {
			index = selectedArray.indexOf(item as (Record<string, unknown> | string | number))
		}

		if (index > -1) {
			selectedArray.splice(index, 1)
			options.selectedItem.value = [...selectedArray]
			options.emitUpdateModelValue([...selectedArray])
		}
	}

	const clearSelection = (event?: Event) => {
		event?.preventDefault()
		event?.stopPropagation()
		options.markTouched()
		options.selectedItem.value = options.multiple.value ? [] : null
		options.emitUpdateModelValue(options.multiple.value ? [] : null)
		if (!options.multiple.value) {
			options.searchValue.value = ''
			options.emitUpdateSearch('')
		}
		options.updateHasError()
		if (event?.type === 'keydown' || event?.type === 'click') {
			if (!options.isOpen.value) {
				options.isOpen.value = true
			}
			options.ensureNativeInputFocus()
		}
	}

	const selectItem = (item: ItemType | null, event?: Event) => {
		event?.preventDefault()
		event?.stopPropagation()

		if (item === null) {
			clearSelection(event)
			return
		}

		if (options.multiple.value) {
			if (!Array.isArray(options.selectedItem.value)) {
				options.selectedItem.value = []
			}
			const selectedArray = options.selectedItem.value as SelectItemArrayType
			const valueToCheck = item[options.valueKey.value]
			const valueToStore = options.returnObject.value
				? item
				: (item[options.valueKey.value] as (string | number))

			const index = selectedArray.findIndex((selected) => {
				if (options.returnObject.value) {
					return (selected as Record<string, unknown>)?.[options.valueKey.value] === valueToCheck
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
			options.searchValue.value = ''
			options.emitUpdateSearch('')
			options.isOpen.value = true
			return
		}

		if (options.returnObject.value) {
			options.selectedItem.value = item
			options.emitUpdateModelValue(item)
		}
		else {
			options.selectedItem.value = item[options.valueKey.value] as (string | number)
			options.emitUpdateModelValue(item[options.valueKey.value] as (string | number))
		}

		options.searchValue.value = String(getPlainItemText(item) ?? '')
		options.emitUpdateSearch(options.searchValue.value)
		options.isOpen.value = false
	}

	return {
		hasChips,
		getPlainItemText,
		getItemText,
		isItemSelected,
		getChipText,
		getChipKey,
		getMultipleSelectionText,
		removeChip,
		clearSelection,
		selectItem,
	}
}
