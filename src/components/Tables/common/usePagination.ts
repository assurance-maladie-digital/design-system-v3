import { computed, nextTick, ref, type Ref } from 'vue'
import type { DataOptions } from './types'

/**
 * Composable for managing table pagination
 *
 * @param options - Reactive reference to table options
 * @param itemsLength - Total number of items (for client-side) or serverItemsLength (for server-side)
 * @returns Pagination utilities and computed properties
 */
export function usePagination({
	options,
	itemsLength,
}: {
	options: Ref<Partial<DataOptions>>
	itemsLength: Ref<number>
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
	async function updateItemsPerPage(newItemsPerPage: number) {
		isUpdatingItemsPerPage.value = true
		await nextTick()
		options.value = {
			...options.value,
			itemsPerPage: newItemsPerPage,
			page: 1,
		}
		await nextTick()
		isUpdatingItemsPerPage.value = false
	}

	return {
		page,
		pageCount,
		itemsPerPageValue,
		updateItemsPerPage,
		isUpdatingItemsPerPage,
	}
}
