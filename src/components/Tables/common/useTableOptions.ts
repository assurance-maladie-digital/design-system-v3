import { computed, type Ref } from 'vue'
import type { DataOptions, FilterOption } from './types'

/**
 * Composable for managing table options and filters
 *
 * @param options - Reactive reference to table options
 * @returns Table options utilities and computed properties
 */
export function useTableOptions({
	options,
}: {
	options: Ref<Partial<DataOptions>>
}) {
	// Helper to avoid emitting update:options when filters have not really changed
	function areFiltersEqual(a: FilterOption[] = [], b: FilterOption[] = []): boolean {
		if (a === b) return true
		if (a.length !== b.length) return false

		for (let i = 0; i < a.length; i++) {
			const fa = a[i]
			const fb = b[i]

			if (fa.key !== fb.key || fa.type !== fb.type) {
				return false
			}

			// Shallow value comparison via JSON stringification to detect effective changes
			if (JSON.stringify(fa.value) !== JSON.stringify(fb.value)) {
				return false
			}
		}

		return true
	}

	// Computed for filters with getter/setter
	const filters = computed({
		get: () => options.value.filters || [],
		set: (newFilters: FilterOption[]) => {
			const currentFilters = options.value.filters || []
			if (areFiltersEqual(currentFilters, newFilters)) {
				// Do not touch options if filters are effectively the same
				return
			}

			options.value = {
				...options.value,
				filters: newFilters,
				page: 1, // reset
			}
		},
	})

	// Computed for sorting options
	const sortBy = computed({
		get: () => options.value.sortBy || [],
		set: (newSortBy) => {
			options.value = {
				...options.value,
				sortBy: newSortBy,
			}
		},
	})

	/**
   * Update options with new values
   */
	function updateOptions(newOptions: Partial<DataOptions>) {
		options.value = {
			...options.value,
			...newOptions,
		}
	}

	/**
   * Reset filters to empty array
   */
	function resetFilters() {
		options.value = {
			...options.value,
			filters: [],
			page: 1, // Reset to first page when clearing filters
		}
	}

	/**
   * Update a specific filter or add it if it doesn't exist
   */
	function updateFilter(filter: FilterOption) {
		const currentFilters = [...filters.value]
		const existingFilterIndex = currentFilters.findIndex(f => f.key === filter.key)

		if (existingFilterIndex >= 0) {
			// Update existing filter
			currentFilters[existingFilterIndex] = filter
		}
		else {
			// Add new filter
			currentFilters.push(filter)
		}

		filters.value = currentFilters
	}

	/**
   * Remove a filter by key
   */
	function removeFilter(key: string) {
		filters.value = filters.value.filter(f => f.key !== key)
	}

	return {
		filters,
		sortBy,
		updateOptions,
		resetFilters,
		updateFilter,
		removeFilter,
	}
}
