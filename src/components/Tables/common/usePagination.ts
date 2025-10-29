import { computed, nextTick, ref, type Ref } from 'vue'
import type { DataOptions } from './types'

/**
 * Composable for managing table pagination
 *
 * @param options - Reactive reference to table options
 * @param itemsLength - Total number of items (for client-side) or serverItemsLength (for server-side)
 * @param table - Reference to the table component
 * @returns Pagination utilities and computed properties
 */
export function usePagination({
	options,
	itemsLength,
	table,
}: {
	options: Ref<Partial<DataOptions>>
	itemsLength: Ref<number>
	table: Ref<unknown>
}) {
	// Flag to indicate an ongoing items-per-page update cycle
	const isUpdatingItemsPerPage = ref(false)
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

	// Items per page with fallback to default
	const itemsPerPageValue = computed(() => {
		const value = options.value.itemsPerPage || 10
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
		isUpdatingItemsPerPage.value = true
		// Apply on nextTick to let any immediate stale @update:options settle, then win with our authoritative values
		nextTick(() => {
			const newOptions = {
				...options.value,
				itemsPerPage: newItemsPerPage,
				page: 1, // Reset to first page when changing items per page
			}

			options.value = newOptions

      // Force a refresh of the table and then release the flag
      nextTick(() => {
        const tableValue = table.value as { $forceUpdate?: () => void }
        if (tableValue && typeof tableValue.$forceUpdate === 'function') {
          tableValue.$forceUpdate()
        }

        // Release the flag after DOM/application settles
        nextTick(() => {
          isUpdatingItemsPerPage.value = false
        })
      })
    })
  }

	return {
		page,
		pageCount,
		itemsPerPageValue,
		updateItemsPerPage,
		isUpdatingItemsPerPage,
	}
}
