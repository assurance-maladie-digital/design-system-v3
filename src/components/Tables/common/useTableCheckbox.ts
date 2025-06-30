import type { MaybeRefOrGetter } from 'vue'
import { toRef } from 'vue'

interface UseTableCheckboxOptions {
	/**
   * The items to be displayed in the table
   */
	items: MaybeRefOrGetter<Record<string, unknown>[]>
	/**
   * The model value for selected items
   */
	modelValue: MaybeRefOrGetter<unknown[]>
	/**
   * Function to update the model value
   */
	updateModelValue: (value: unknown[]) => void
}

export function useTableCheckbox(options: UseTableCheckboxOptions) {
	const itemsRef = toRef(options.items)
	const modelValueRef = toRef(options.modelValue)

	/**
   * Function to get a unique identifier for each item
   */
	const getItemValue = (item: Record<string, unknown>) => {
		// If the item has an id field, use that
		if (item.id !== undefined) {
			return item.id
		}
		// Otherwise, create a unique string representation of the item
		return JSON.stringify(item)
	}

	/**
   * Function to toggle selection of all rows
   */
	const toggleAllRows = () => {
		// Ensure items is an array
		const itemsArray = Array.isArray(itemsRef.value) ? itemsRef.value : []
		const items = itemsArray.length > 0 ? itemsArray : []

		if (modelValueRef.value.length === items.length) {
			// If all items are selected, deselect all
			options.updateModelValue([])
		}
		else {
			// Otherwise, select all items
			// We need to map the items to their values to ensure proper selection
			options.updateModelValue(items.map(item => getItemValue(item)))
		}
	}

	return {
		getItemValue,
		toggleAllRows,
	}
}
