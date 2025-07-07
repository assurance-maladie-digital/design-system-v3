import type { FilterOption } from './types'
import filterByPeriod from './filters/logics/period'
import filterByExactDate from './filters/logics/date'
import filterByNumber from './filters/logics/number'
import filterBySelect from './filters/logics/select'
import filterByText from './filters/logics/text'

export function filterItems<T extends Record<string, unknown>>(items: T[], filters: FilterOption[]): T[] {
	if (!Array.isArray(items) || items.length === 0) return []
	if (!Array.isArray(filters) || filters.length === 0) return items

	return items.filter((item) => {
		return filters.every(filter => applyFilter(item, filter))
	})
}

function applyFilter<T extends Record<string, unknown>>(item: T, filter: FilterOption): boolean {
	if (!filter.key) return true

	const itemValue = item[filter.key]
	const filterValue = filter.value

	if (filterValue == null) return true

	switch (filter.type) {
		case 'text': {
			return filterByText(itemValue, filterValue)
		}
		case 'number': {
			return filterByNumber(itemValue, filterValue)
		}
		case 'select': {
			return filterBySelect(itemValue, filterValue)
		}
		case 'custom': {
			// Traiter les filtres personnalisés comme des filtres de sélection
			return filterBySelect(itemValue, filterValue)
		}
		case 'period':{
			return filterByPeriod(itemValue, filterValue)
		}
		case 'date': {
			return filterByExactDate(itemValue, filterValue)
		}
		default:
			return true
	}
}

export function parseDate(value: unknown): Date | null {
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
	// Traite le type nombre
	if (typeof value === 'number') {
		const parsed = new Date(value)
		return isNaN(parsed.getTime()) ? null : parsed
	}
	// Ignore les objets vides
	if (value === null || value === undefined || (typeof value === 'object' && Object.keys(value as object).length === 0)) {
		return null
	}
	return null
}
