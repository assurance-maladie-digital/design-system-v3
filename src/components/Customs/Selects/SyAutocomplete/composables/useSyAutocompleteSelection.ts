import { type Ref } from 'vue'

import type { ItemType, SelectItemArrayType, SelectItemValueType } from '../types'

import {
	useSyComboboxChipsHelpers,
	useSyComboboxGetItemText,
	useSyComboboxGetPlainItemText,
	useSyComboboxIsItemSelected,
} from '../../common/combobox/useSyComboboxSelectionHelpers'

export interface UseSyAutocompleteSelectionOptions {
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
	const { getItemText } = useSyComboboxGetItemText(options.textKey)
	const { getPlainItemText } = useSyComboboxGetPlainItemText({
		textKey: options.textKey,
		plainTextKey: options.plainTextKey,
		allowHtml: options.allowHtml,
	})
	const { isItemSelected } = useSyComboboxIsItemSelected({
		multiple: options.multiple,
		returnObject: options.returnObject,
		valueKey: options.valueKey,
		selectedItem: options.selectedItem,
	})
	const {
		hasChips,
		getChipText,
		getChipKey,
		removeChip,
	} = useSyComboboxChipsHelpers({
		chips: options.chips,
		multiple: options.multiple,
		returnObject: options.returnObject,
		textKey: options.textKey,
		valueKey: options.valueKey,
		items: options.internalItems,
		selectedItem: options.selectedItem,
		emitUpdateModelValue: options.emitUpdateModelValue,
	})

	const getMultipleSelectionText = () => {
		if (!options.multiple.value || options.chips.value) return ''
		if (!Array.isArray(options.selectedItem.value) || options.selectedItem.value.length === 0) return ''
		return options.selectedItem.value.map(item => getChipText(item)).filter(Boolean).join(', ')
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
