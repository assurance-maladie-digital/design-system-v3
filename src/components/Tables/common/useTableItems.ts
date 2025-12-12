import { computed, type Ref } from 'vue'
import type { DataOptions, FilterOption, Items, TableColumnHeader } from './types'

/**
 * Composable for handling table items processing
 *
 * @param items - Reference to table items
 * @param filters - Reference to active filters
 * @param options - Reference to table options
 * @param filterItems - Function to filter items (from useTableFilter)
 * @returns Item utilities and computed properties
 */
export function useTableItems({
	items,
	filters,
	options,
	filterItems,
}: {
	items: Ref<Items>
	headers: Ref<TableColumnHeader[] | undefined>
	filters: Ref<FilterOption[]>
	options: Ref<Partial<DataOptions>>
	filterItems: <T extends Items[0]>(items: T[], filters: FilterOption[]) => T[]
}) {
	// Filter items based on active filters
	const filteredItems = computed(() => {
		// Create a deep copy of items to avoid modifying originals

		// Apply filters to copied items
		return filterItems(items.value, filters.value)
	})
	// Apply pagination to filtered items
	const paginatedItems = computed(() => {
		if (!filteredItems.value.length) return []

		const page = options.value.page || 1
		const itemsPerPage = options.value.itemsPerPage || 10

		// If itemsPerPage is -1 ("Tous"), return all items
		if (itemsPerPage === -1) return filteredItems.value

		const start = (page - 1) * itemsPerPage
		const end = start + itemsPerPage

		return filteredItems.value.slice(start, end)
	})

	return {
		filteredItems,
		paginatedItems,
	}
}
