import type { FilterOption } from './types'

/**
 * Filter items based on filters
 *
 * @param items - The items to filter
 * @param filters - The filters to apply
 * @returns Filtered items
 */
export function filterItems<T extends Record<string, unknown>>(items: T[], filters: FilterOption[]): T[] {
	// Return all items if no filters are provided
	if (!filters || !Array.isArray(filters) || filters.length === 0) return [...items]
	// Return empty array if no items are provided
	if (!items || !Array.isArray(items) || items.length === 0) return []
	// Create a deep copy of the items to prevent mutations
	const itemsCopy = JSON.parse(JSON.stringify(items)) as T[]

	// Extract date filters and non-date filters
	const dateFilters = filters.filter(f => f.type === 'date' && f.value !== null && f.value !== undefined)
	const nonDateFilters = filters.filter(f => f.type !== 'date')

	// Special handling for date filters
	if (dateFilters.length > 0) {
		// First pass: apply only date filters to see if we get any matches
		const dateFilteredItems = itemsCopy.filter((item) => {
			return dateFilters.every((filter) => {
				if (!filter.key) return true
				const itemValue = item[filter.key]
				if (itemValue === undefined || itemValue === null) return false

				// Handle Date objects
				if (itemValue instanceof Date && filter.value instanceof Date) {
					// Compare dates by converting to same format (day only, ignoring time)
					const itemDateStr = itemValue.toLocaleDateString('fr-FR')
					const filterDateStr = filter.value.toLocaleDateString('fr-FR')
					return itemDateStr === filterDateStr
				}

				// Handle string dates
				if (typeof itemValue === 'string' && filter.value instanceof Date) {
					try {
						const filterDate = filter.value.toLocaleDateString('fr-FR')
						return itemValue === filterDate || itemValue.includes(filterDate)
					}
					catch (e) {
						console.error('Error comparing dates:', e)
						return false
					}
				}

				// If filter value is a string
				if (typeof itemValue === 'string' && typeof filter.value === 'string') {
					return itemValue === filter.value || itemValue.includes(filter.value)
				}

				return false
			})
		})

		// If no items match the date filter, return all items
		if (dateFilteredItems.length === 0) {
			// If we have other filters, apply only those
			if (nonDateFilters.length > 0) {
				return itemsCopy.filter((item) => {
					return nonDateFilters.every(filter => applyFilter(item, filter))
				})
			}

			// If we only had date filters, return all items
			return itemsCopy
		}

		// If we have date matches and other filters
		if (nonDateFilters.length > 0) {
			return dateFilteredItems.filter((item) => {
				return nonDateFilters.every(filter => applyFilter(item, filter))
			})
		}

		// If we only have date filters with matches
		return dateFilteredItems
	}

	// Apply standard filtering for non-date filters
	return itemsCopy.filter((item) => {
		return filters.every(filter => applyFilter(item, filter))
	})
}

/**
 * Apply a single filter to an item
 *
 * @param item - The item to filter
 * @param filter - The filter to apply
 * @returns Whether the item passes the filter
 */
function applyFilter<T extends Record<string, unknown>>(item: T, filter: FilterOption): boolean {
	// Skip if filter key is not provided
	if (!filter.key) return true

	// Get item value for the filter key
	const itemValue = item[filter.key]

	// Skip if item value is not provided
	if (itemValue === undefined || itemValue === null) return true

	// Skip if filter value is not provided
	if (filter.value === undefined || filter.value === null) return true

	// Handle different filter types
	switch (filter.type) {
		case 'text':
			// Handle string values
			if (typeof filter.value === 'string') {
				// Skip empty filter values
				if (filter.value.trim() === '') return true

				const filterValue = filter.value.toLowerCase()

				// Handle string item values
				if (typeof itemValue === 'string') {
					return itemValue.toLowerCase().includes(filterValue)
				}

				// Handle number item values
				if (typeof itemValue === 'number') {
					return itemValue.toString().toLowerCase().includes(filterValue)
				}

				// Handle boolean item values
				if (typeof itemValue === 'boolean') {
					return itemValue.toString().toLowerCase().includes(filterValue)
				}

				// Handle object item values with toString method
				if (itemValue !== null && typeof itemValue === 'object') {
					try {
						// Try to convert to JSON string first
						const jsonString = JSON.stringify(itemValue).toLowerCase()
						if (jsonString.includes(filterValue)) return true

						// Fallback to simple string conversion
						const stringValue = String(itemValue).toLowerCase()
						return stringValue.includes(filterValue)
					}
					catch {
						// If JSON conversion fails, use simple string conversion
						const stringValue = String(itemValue).toLowerCase()
						return stringValue.includes(filterValue)
					}
				}
			}
			return true // Return true for empty or invalid text filters
		case 'number':
			// Handle number filtering
			if (typeof itemValue === 'number') {
				// If filter value is a number, do exact comparison
				if (typeof filter.value === 'number') {
					return itemValue === filter.value
				}
				// If filter value is a string, convert to string and check if includes
				if (typeof filter.value === 'string') {
					const itemValueStr = itemValue.toString()
					return itemValueStr.includes(filter.value)
				}
			}
			break
		case 'select':
			// Handle array values
			if (Array.isArray(filter.value)) {
				return filter.value.includes(itemValue as never)
			}
			// Handle object values (for returnObject: true in SySelect)
			if (typeof filter.value === 'object' && filter.value !== null && typeof itemValue === 'object' && itemValue !== null) {
				// Try to compare by value property if it exists
				if ('value' in filter.value && 'value' in itemValue) {
					return (filter.value as Record<string, unknown>).value === (itemValue as Record<string, unknown>).value
				}
				// Otherwise do a strict equality check
				return JSON.stringify(filter.value) === JSON.stringify(itemValue)
			}
			// Handle primitive values
			return itemValue === filter.value
		case 'period':
			// Skip empty period filters
			if (!filter.value) return true

			if (typeof filter.value === 'object' && filter.value !== null) {
				// Handle period with Date objects or string dates
				const periodValue = filter.value as { from?: Date | string | null, to?: Date | string | null }
				const from = periodValue.from
				const to = periodValue.to

				// Skip if both from and to are null/undefined
				if ((from === null || from === undefined) && (to === null || to === undefined)) {
					return true
				}

				// Handle Date object in item
				if (itemValue instanceof Date) {
					const dateValue = itemValue.getTime()

					if (from instanceof Date && to instanceof Date) {
						return dateValue >= from.getTime() && dateValue <= to.getTime()
					}
					else if (from instanceof Date) {
						return dateValue >= from.getTime()
					}
					else if (to instanceof Date) {
						return dateValue <= to.getTime()
					}
				}

				// Handle string date in item - with additional defensive checks
				if (typeof itemValue === 'object' && itemValue !== null && 'from' in itemValue && 'to' in itemValue) {
					// Safely access from and to properties
					const itemFrom = itemValue.from || null
					const itemTo = itemValue.to || null

					// Simple case: exact string match
					if (typeof itemFrom === 'string' && typeof itemTo === 'string') {
						// If both filter values are provided
						if (from !== null && from !== undefined && to !== null && to !== undefined) {
							// Convert dates to comparable format
							const fromStr = from instanceof Date ? from.toLocaleDateString('fr-FR') : String(from)
							const toStr = to instanceof Date ? to.toLocaleDateString('fr-FR') : String(to)

							// Check for exact match or partial match
							return (
								(itemFrom === fromStr || itemFrom.includes(fromStr))
								&& (itemTo === toStr || itemTo.includes(toStr))
							)
						}
						// If only from date is provided
						else if (from !== null && from !== undefined) {
							const fromStr = from instanceof Date ? from.toLocaleDateString('fr-FR') : String(from)
							return itemFrom === fromStr || itemFrom.includes(fromStr)
						}
						// If only to date is provided
						else if (to !== null && to !== undefined) {
							const toStr = to instanceof Date ? to.toLocaleDateString('fr-FR') : String(to)
							return itemTo === toStr || itemTo.includes(toStr)
						}
					}
				}
			}
			break
		case 'date':
			// Date filtering is handled separately in the main filterItems function
			return true
	}

	// Default to true for unhandled cases
	return true
}
