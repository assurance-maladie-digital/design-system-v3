import type { ComputedRef } from 'vue'
import type { ItemType, SelectPrimitive } from '../types'

interface ItemUtilsProps {
	textKey: string
	valueKey: string
	plainTextKey: string
	returnObject: boolean
}

export function useItemUtils(props: ItemUtilsProps, formattedItems: ComputedRef<ItemType[]>) {
	const getItemText = (item: unknown) => {
		return (item as Record<string, unknown>)[props.textKey] as string | undefined
	}

	const getPlainText = (item: ItemType): string => {
		if (props.plainTextKey && item[props.plainTextKey]) return String(item[props.plainTextKey] ?? '')
		return String(item[props.textKey] ?? '')
	}

	const getValueKey = (item: ItemType | SelectPrimitive): SelectPrimitive =>
		typeof item === 'object'
			? item[props.valueKey] as SelectPrimitive
			: item

	const getStoredValue = (item: ItemType | SelectPrimitive) =>
		props.returnObject ? item : getValueKey(item)

	const getChipLabel = (chip: ItemType | SelectPrimitive): string => {
		if (props.returnObject && typeof chip === 'object' && chip !== null) {
			return getPlainText(chip as ItemType)
		}
		const found = formattedItems.value.find(i => i[props.valueKey] === chip)
		if (found) return getPlainText(found)
		return String(chip ?? '')
	}

	return {
		getItemText,
		getPlainText,
		getValueKey,
		getStoredValue,
		getChipLabel,
	}
}
