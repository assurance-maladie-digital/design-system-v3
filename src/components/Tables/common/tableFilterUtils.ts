import type { FilterOption } from './types'

/**
 * Filter items based on filters
 *
 * @param items - The items to filter
 * @param filters - The filters to apply
 * @returns Filtered items
 */
export function filterItems<T>(items: T[], filters: FilterOption[]): T[] {
	if (!filters || filters.length === 0) return items

	return items.filter((item) => {
		return filters.every((filter) => {
			if (!filter || !filter.key || !filter.value) return true

			const itemValue = item[filter.key]

			// Handle different filter types
			switch (filter.type) {
				case 'text':
					if (typeof itemValue === 'string' && typeof filter.value === 'string') {
						return itemValue.toLowerCase().includes(filter.value.toLowerCase())
					}
					break
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
					// Handle null or undefined values
					if (filter.value === null || filter.value === undefined) {
						return true
					}
					// Handle array values
					if (Array.isArray(filter.value)) {
						return filter.value.includes(itemValue)
					}
					// Handle object values (for returnObject: true in SySelect)
					if (typeof filter.value === 'object' && filter.value !== null && typeof itemValue === 'object' && itemValue !== null) {
						// Try to compare by value property if it exists
						if ('value' in filter.value && 'value' in itemValue) {
							return filter.value.value === itemValue.value
						}
						// Otherwise do a strict equality check
						return JSON.stringify(filter.value) === JSON.stringify(itemValue)
					}
					// Handle primitive values
					return itemValue === filter.value
				case 'date':
					if (itemValue instanceof Date && filter.value instanceof Date) {
						return itemValue.getTime() === filter.value.getTime()
					}
					break
				case 'period':
					if (typeof filter.value === 'object' && filter.value !== null) {
						const { from, to } = filter.value as { from?: Date, to?: Date }
						if (itemValue instanceof Date) {
							const dateValue = itemValue.getTime()
							if (from && to) {
								return dateValue >= from.getTime() && dateValue <= to.getTime()
							}
							else if (from) {
								return dateValue >= from.getTime()
							}
							else if (to) {
								return dateValue <= to.getTime()
							}
						}
					}
					break
				default:
					if (typeof itemValue === 'string' && typeof filter.value === 'string') {
						return itemValue.toLowerCase().includes(filter.value.toLowerCase())
					}
			}

			return false
		})
	})
}
