import type { FilterOption } from './types'

function parseDate(value: unknown): Date | null {
	if (value instanceof Date) return value
	if (typeof value === 'string') {
		try {
			if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(value)) {
				const [day, month, year] = value.split('/').map(Number)
				return new Date(year, month - 1, day)
			}
			const parsed = new Date(value)
			return isNaN(parsed.getTime()) ? null : parsed
		}
		catch {
			return null
		}
	}
	// Handle number type
	if (typeof value === 'number') {
		const parsed = new Date(value)
		return isNaN(parsed.getTime()) ? null : parsed
	}
	// Skip empty objects
	if (value === null || value === undefined || (typeof value === 'object' && Object.keys(value as object).length === 0)) {
		return null
	}
	return null
}

export function filterItems<T extends Record<string, unknown>>(items: T[], filters: FilterOption[]): T[] {
	if (!Array.isArray(items) || items.length === 0) return []
	if (!Array.isArray(filters) || filters.length === 0) return items

	const dateFilters = filters.filter(f => f.type === 'date' && f.value != null)
	const otherFilters = filters.filter(f => f.type !== 'date')

	let result = items

	// Apply date filters first if present
	if (dateFilters.length > 0) {
		result = result.filter(item =>
			dateFilters.every((filter) => {
				if (!filter.key) return true
				const itemDate = parseDate(item[filter.key])
				const filterDate = parseDate(filter.value)
				if (!itemDate || !filterDate) return false
				return (
					itemDate.getDate() === filterDate.getDate()
					&& itemDate.getMonth() === filterDate.getMonth()
					&& itemDate.getFullYear() === filterDate.getFullYear()
				)
			}),
		)
	}

	// Apply other filters
	if (otherFilters.length > 0) {
		result = result.filter(item =>
			otherFilters.every(filter => applyFilter(item, filter)),
		)
	}

	return result
}

function applyFilter<T extends Record<string, unknown>>(item: T, filter: FilterOption): boolean {
	if (!filter.key) return true

	const itemValue = item[filter.key]
	const filterValue = filter.value

	if (itemValue == null || filterValue == null) return true

	switch (filter.type) {
		case 'text': {
			const str = String(itemValue).toLowerCase()
			const search = String(filterValue).toLowerCase()
			return str.includes(search)
		}
		case 'number': {
			if (typeof itemValue === 'number') {
				if (typeof filterValue === 'number') return itemValue === filterValue
				return String(itemValue).includes(String(filterValue))
			}
			return false
		}
		case 'select': {
			if (Array.isArray(filterValue)) {
				// Use type assertion to handle the includes method
				// We need to cast to unknown first to avoid direct any usage
				return filterValue.includes(itemValue as unknown as typeof filterValue[0])
			}
			if (typeof filterValue === 'object' && filterValue != null) {
				return JSON.stringify(filterValue) === JSON.stringify(itemValue)
			}
			return itemValue === filterValue
		}
		case 'period': {
			if (
				typeof itemValue === 'object'
				&& itemValue !== null
				&& 'from' in itemValue
				&& 'to' in itemValue
			) {
				const { from, to } = filterValue as { from?: string | Date, to?: string | Date }
				const itemFrom = parseDate(itemValue.from)
				const itemTo = parseDate(itemValue.to)
				const fromDate = parseDate(from)
				const toDate = parseDate(to)

				if (!itemFrom || !itemTo) return false

				if (fromDate && toDate) return fromDate <= itemTo && toDate >= itemFrom
				if (fromDate) return itemTo >= fromDate
				if (toDate) return itemFrom <= toDate
			}
			return false
		}
		case 'date': {
			const itemDate = parseDate(itemValue)
			const targetDate = parseDate(filterValue)
			if (!itemDate || !targetDate) return false
			return (
				itemDate.getDate() === targetDate.getDate()
				&& itemDate.getMonth() === targetDate.getMonth()
				&& itemDate.getFullYear() === targetDate.getFullYear()
			)
		}
		default:
			return true
	}
}
