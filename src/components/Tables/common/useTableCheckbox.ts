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
	/**
	 * Optional key to use for item selection value. If not provided, falls back to `id` then the full object.
	 */
	selectionKey?: MaybeRefOrGetter<string | undefined>
}
export function useTableCheckbox(options: UseTableCheckboxOptions) {
	const itemsRef = toRef(options.items)
	const modelValueRef = toRef(options.modelValue)
	const selectionKeyRef = toRef(options as { selectionKey?: MaybeRefOrGetter<string | undefined> }, 'selectionKey')

	/**
	 * Function to get a unique identifier for each item
	 */
	const getItemValue = (item: Record<string, unknown>) => {
		// 1) If a custom selectionKey is provided and exists on item, use it
		const key = (typeof selectionKeyRef?.value === 'function'
			? (selectionKeyRef.value as unknown as () => string | undefined)()
			: selectionKeyRef?.value) as string | undefined
		if (key && typeof key === 'string' && item[key] !== undefined) {
			return item[key]
		}
		// 2) Otherwise, if the item has an id field, use that
		if (item.id !== undefined) {
			return item.id
		}
		// Otherwise, return the full object instead of a JSON string
		// so v-model contains real objects
		return item
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
