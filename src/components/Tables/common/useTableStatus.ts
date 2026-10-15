import { computed, nextTick, shallowRef, toValue, watch, type MaybeRefOrGetter, type Ref } from 'vue'
import { locales } from './locales'
import type { DataOptions, DataTableHeaders } from './types'

/** Announces only changes to the table state. */
export function useTableStatus(input: {
	page: MaybeRefOrGetter<number>
	itemsPerPage: MaybeRefOrGetter<number>
	total: MaybeRefOrGetter<number>
	selected: MaybeRefOrGetter<number>
	options: MaybeRefOrGetter<Partial<DataOptions>>
	headers: MaybeRefOrGetter<DataTableHeaders[] | undefined>
}): Ref<string> {
	const message = shallowRef('')
	const state = computed(() => {
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
		return {
			pagination: locales.visibleRows(start, end, total, page),
			selection: locales.selectedCount(toValue(input.selected)),
			filters: JSON.stringify(options.filters || []),
			filterCount: locales.activeFilters(options.filters?.length || 0),
			sort,
		}
	})

	// Batch related changes (for example filtering and the resulting page reset).
	// Keep the region empty initially so mounting does not announce the whole state.
	watch(state, async (current, previous, onCleanup) => {
		const changes: string[] = []
		if (current.pagination !== previous.pagination) changes.push(current.pagination)
		if (current.selection !== previous.selection) changes.push(current.selection)
		if (current.filters !== previous.filters) changes.push(current.filterCount)
		if (current.sort !== previous.sort) changes.push(current.sort)
		if (!changes.length) return
		const announcement = changes.join(' ')
		if (announcement === message.value) {
			// An updated filter can keep the same count; trigger a fresh DOM change.
			let cancelled = false
			onCleanup(() => {
				cancelled = true
			})
			message.value = ''
			await nextTick()
			if (cancelled) return
		}
		message.value = announcement
	}, { flush: 'post' })

	return message
}
