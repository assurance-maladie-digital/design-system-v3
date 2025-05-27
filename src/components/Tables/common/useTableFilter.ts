import { inject } from 'vue'
import type { FilterOption } from './types'
import { filterItems as filterItemsUtil } from './tableFilterUtils'

/**
 * Composable for using table filtering functionality
 *
 * @returns Object containing filter utility functions
 */
export function useTableFilter() {
	// Get the filterItems function from the provide/inject pattern
	const filterItems = inject<
		<T extends Record<string, unknown>>(items: T[], filters: FilterOption[]) => T[]
	>('filterItems', filterItemsUtil)

	return {
		filterItems,
	}
}
