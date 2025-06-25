import { computed, nextTick, type Ref } from 'vue'
import type { DataOptions } from './types'

/**
 * Composable for managing table pagination
 *
 * @param options - Reactive reference to table options
 * @param itemsPerPageProp - Default items per page from props
 * @param itemsLength - Total number of items (for client-side) or serverItemsLength (for server-side)
 * @param table - Reference to the table component
 * @param emit - Emit function for update:options event
 * @returns Pagination utilities and computed properties
 */
export function usePagination({
	options,
	itemsPerPageProp,
	itemsLength,
	table,
	emit,
}: {
	options: Ref<Partial<DataOptions>>
	itemsPerPageProp?: number
	itemsLength: Ref<number>
	table: Ref<unknown>
	emit: (event: 'update:options', options: Partial<DataOptions>) => void
}) {
	// Current page with getter/setter
	const page = computed({
		get: () => options.value.page || 1,
		set: (newPage: number) => {
			options.value = {
				...options.value,
				page: newPage,
			}
		},
	})

	// Items per page with fallback to props or default
	const itemsPerPageValue = computed(() => {
		const value = options.value.itemsPerPage || itemsPerPageProp || 10
		// If value is -1, it means "Tous" (all items)
		return value
	})

	// Calculate total number of pages
	const pageCount = computed(() => {
		if (!itemsLength.value) return 0
		// If itemsPerPageValue is -1 ("Tous"), return 1 page
		if (itemsPerPageValue.value === -1) return 1
		return Math.ceil(itemsLength.value / itemsPerPageValue.value)
	})

	/**
   * Update items per page from pagination component
   */
	function updateItemsPerPage(newItemsPerPage: number) {
		// Create a completely new options object to force reactivity
		const newOptions = {
			...options.value,
			itemsPerPage: newItemsPerPage,
			page: 1, // Reset to first page when changing items per page
		}

		// Update options with the new object
		options.value = newOptions

		// Force a refresh of the table
		nextTick(() => {
			// Try to force update if the table has that method
			const tableValue = table.value as { $forceUpdate?: () => void }
			if (tableValue && typeof tableValue.$forceUpdate === 'function') {
				tableValue.$forceUpdate()
			}

			// Emit an event to notify parent components
			emit('update:options', newOptions)
		})
	}

	return {
		page,
		pageCount,
		itemsPerPageValue,
		updateItemsPerPage,
	}
}
