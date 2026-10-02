import { computed, toValue, type ComputedRef, type MaybeRefOrGetter } from 'vue'
import { locales } from '../common/locales'
import type { DataOptions, DataTableHeaders } from '../common/types'

/** Builds the live announcement for client-side table interactions. */
export function useTableStatus(input: {
	page: MaybeRefOrGetter<number>
	itemsPerPage: MaybeRefOrGetter<number>
	total: MaybeRefOrGetter<number>
	selected: MaybeRefOrGetter<number>
	selectedRows: MaybeRefOrGetter<number[]>
	options: MaybeRefOrGetter<Partial<DataOptions>>
	headers: MaybeRefOrGetter<DataTableHeaders[] | undefined>
}): ComputedRef<string> {
	return computed(() => {
		const total = toValue(input.total)
		const page = toValue(input.page)
		const size = toValue(input.itemsPerPage)
		const start = total === 0 ? 0 : size === -1 ? 1 : (page - 1) * size + 1
		const end = size === -1 ? total : Math.min(page * size, total)
		const options = toValue(input.options)
		const sort = options.sortBy?.map((entry) => {
			const header = toValue(input.headers)?.find(header => (header.key || header.value) === entry.key)
			return `${header?.title || entry.key} : ${entry.order === 'desc' ? locales.sortDescending : locales.sortAscending}`
		}).join('. ') || locales.sortNone
		return [
			locales.visibleRows(start, end, total, page),
			locales.selectedCount(toValue(input.selected)),
			toValue(input.selectedRows).length ? locales.selectedRows(toValue(input.selectedRows).join(', ')) : '',
			locales.activeFilters(options.filters?.length || 0),
			sort,
		].join(' ')
	})
}
