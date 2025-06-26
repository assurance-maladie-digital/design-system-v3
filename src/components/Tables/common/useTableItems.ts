import { computed, type Ref } from 'vue'
import { processItems } from './formatters'
import type { DataOptions, FilterOption, TableColumnHeader } from './types'

/**
 * Composable for handling table items processing
 *
 * @param items - Reference to table items
 * @param headers - Reference to table headers
 * @param filters - Reference to active filters
 * @param options - Reference to table options
 * @param filterItems - Function to filter items (from useTableFilter)
 * @returns Item utilities and computed properties
 */
export function useTableItems({
	items,
	headers,
	filters,
	options,
	filterItems,
}: {
	items: Ref<Record<string, unknown>[]>
	headers: Ref<TableColumnHeader[] | undefined>
	filters: Ref<FilterOption[]>
	options: Ref<Partial<DataOptions>>
	filterItems: <T extends Record<string, unknown>>(items: T[], filters: FilterOption[]) => T[]
}) {
	// Process items with formatters based on headers
	const processedItems = computed(() => {
		if (!headers.value) return items.value
		// Just return the items as is since we can't process them with headers
		return processItems(items.value)
	})

	// Filter items based on active filters
	const filteredItems = computed(() => {
		// Create a deep copy of items to avoid modifying originals
		const itemsCopy = processedItems.value.map((item) => {
			return JSON.parse(JSON.stringify(item))
		})

		// Apply filters to copied items
		return filterItems(itemsCopy, filters.value)
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

	/**
   * Create an empty item that maintains the structure of columns
   * Useful for displaying empty state with correct column structure
   */
	function createEmptyItemWithStructure(): Record<string, unknown>[] {
		if (!headers.value || !headers.value.length) return []

		const emptyItem: Record<string, unknown> = {}

		// Create an empty object with all header keys
		headers.value.forEach((header) => {
			if (header.key) {
				emptyItem[header.key] = ''
			}
		})

		return [emptyItem]
	}

	return {
		processedItems,
		filteredItems,
		paginatedItems,
		createEmptyItemWithStructure,
	}
}
