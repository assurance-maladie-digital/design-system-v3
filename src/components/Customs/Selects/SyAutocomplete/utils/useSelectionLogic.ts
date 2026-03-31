import type { Ref } from 'vue'
import type { ItemType, SelectValue, SelectArray } from '../types'

interface SelectionLogicProps {
	multiple: boolean
	returnObject: boolean
	valueKey: string
}

type EmitFunction = (event: 'update:modelValue', value: SelectValue | SelectArray) => void

export function useSelectionLogic(
	props: SelectionLogicProps,
	getValueKey: (item: ItemType | string | number) => string | number,
	getStoredValue: (item: ItemType | string | number) => ItemType | string | number,
	getPlainText: (item: ItemType) => string,
	selected: Ref<SelectValue | SelectArray>,
	search: Ref<string>,
	emit: EmitFunction,
) {
	const resetValue = () => {
		selected.value = null
		search.value = ''
		emit('update:modelValue', null)
	}

	const updateMultipleSelection = (valueKeyValue: string | number, valueToStore: ItemType | string | number) => {
		const arr: (ItemType | string | number)[] = Array.isArray(selected.value) ? [...selected.value] : []
		const index = arr.findIndex(val =>
			props.returnObject
				? (val as ItemType)[props.valueKey] === valueKeyValue
				: val === valueKeyValue,
		)
		if (index >= 0) {
			arr.splice(index, 1)
		}
		else {
			arr.push(valueToStore)
		}
		selected.value = arr as SelectArray
		if (arr.length === 0) {
			emit('update:modelValue', null)
		}
		else {
			emit('update:modelValue', arr as SelectArray)
		}
	}

	const updateSingleSelection = (valueToStore: SelectValue, item: ItemType) => {
		selected.value = valueToStore
		search.value = getPlainText(item)
		emit('update:modelValue', selected.value)
	}

	const updateValue = (item: ItemType | string | number | null) => {
		if (item === null) {
			resetValue()
			return
		}

		const valueKeyValue = getValueKey(item)
		const valueToStore = getStoredValue(item)

		if (props.multiple) {
			updateMultipleSelection(valueKeyValue, valueToStore)
		}
		else {
			updateSingleSelection(valueToStore as SelectValue, item as ItemType)
		}
	}

	return { updateValue }
}
