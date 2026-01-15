import { computed, type ComputedRef, type Ref } from 'vue'

type ItemType = {
	[key: string]: unknown
}

type SelectItemValueType = Record<string, unknown> | string | number | null | undefined

type SelectItemArrayType = Array<Record<string, unknown> | string | number>

type GetPlainItemTextOptions = {
	textKey: Ref<string>
	plainTextKey: Ref<string | undefined>
	allowHtml: Ref<boolean>
}

type BaseSelectionOptions = {
	multiple: Ref<boolean>
	returnObject: Ref<boolean>
	valueKey: Ref<string>
	selectedItem: Ref<SelectItemValueType | SelectItemArrayType>
}

export function useSyComboboxGetItemText(textKey: Ref<string>) {
	const getItemText = (item: unknown) => {
		const value = (item as Record<string, unknown> | null | undefined)?.[textKey.value]
		return value == null ? '' : String(value)
	}

	return { getItemText }
}

export function useSyComboboxGetPlainItemText(options: GetPlainItemTextOptions) {
	const getPlainItemText = (item: unknown) => {
		const itemObj = item as Record<string, unknown>
		if (options.plainTextKey.value && options.allowHtml.value && itemObj[options.plainTextKey.value]) {
			const value = itemObj[options.plainTextKey.value]
			return value == null ? '' : String(value)
		}
		const value = itemObj[options.textKey.value]
		return value == null ? '' : String(value)
	}

	return { getPlainItemText }
}

export function useSyComboboxIsItemSelected(options: BaseSelectionOptions) {
	const isItemSelected = (item: ItemType) => {
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
				(options.selectedItem.value as Record<string, unknown> | null | undefined)?.[options.valueKey.value] === item?.[options.valueKey.value],
			)
		}

		return options.selectedItem.value === item?.[options.valueKey.value]
	}

	return { isItemSelected }
}

type ChipsHelpersOptions = {
	chips: Ref<boolean>
	multiple: Ref<boolean>
	returnObject: Ref<boolean>
	textKey: Ref<string>
	valueKey: Ref<string>
	items: Ref<ItemType[]>
	selectedItem: Ref<SelectItemValueType | SelectItemArrayType>
	emitUpdateModelValue: (value: SelectItemValueType | SelectItemArrayType) => void
}

export function useSyComboboxChipsHelpers(options: ChipsHelpersOptions) {
	const hasChips = computed(() => {
		return options.chips.value
			&& options.multiple.value
			&& Array.isArray(options.selectedItem.value)
			&& options.selectedItem.value.length > 0
	})

	const selectedChipsItems: ComputedRef<SelectItemArrayType> = computed(() => {
		return Array.isArray(options.selectedItem.value) ? options.selectedItem.value : []
	})

	const getChipKey = (item: unknown) => {
		if (options.returnObject.value && typeof item === 'object' && item) {
			const key = (item as Record<string, unknown>)[options.valueKey.value]
			return (typeof key === 'string' || typeof key === 'number') ? key : String(key)
		}
		return (typeof item === 'string' || typeof item === 'number') ? item : String(item)
	}

	const getChipText = (item: unknown) => {
		if (typeof item === 'object' && item) {
			return (item as Record<string, unknown>)[options.textKey.value] as string
		}

		return (
			options.items.value.find((i: ItemType) => i[options.valueKey.value] === item)?.[options.textKey.value] as string
		) || ''
	}

	const removeChip = (item: unknown) => {
		if (!Array.isArray(options.selectedItem.value)) return

		const selectedArray = [...options.selectedItem.value]
		let index = -1

		if (options.returnObject.value) {
			const itemValue = (item as Record<string, unknown> | null | undefined)?.[options.valueKey.value]
			index = selectedArray.findIndex(selected =>
				(selected as Record<string, unknown> | null | undefined)?.[options.valueKey.value] === itemValue,
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

	return {
		hasChips,
		selectedChipsItems,
		getChipKey,
		getChipText,
		removeChip,
	}
}

export function useSyComboboxHasSelectionToClear(
	multiple: Ref<boolean>,
	selectedItem: Ref<SelectItemValueType | SelectItemArrayType>,
) {
	const hasSelectionToClear = computed(() => {
		return multiple.value
			? (((selectedItem.value as unknown[] | null | undefined)?.length) ?? 0) > 0
			: selectedItem.value != null
	})

	return { hasSelectionToClear }
}
