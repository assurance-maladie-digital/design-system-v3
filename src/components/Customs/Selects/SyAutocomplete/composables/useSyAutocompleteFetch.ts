import { ref, type Ref } from 'vue'

import type { ItemType } from '../types'

type UseSyAutocompleteFetchOptions = {
	items: Ref<ItemType[]>
	fetchItems?: ((query: string) => Promise<ItemType[]>) | undefined
	minChars: Ref<number>
	debounceMs: Ref<number>
	cache: Ref<boolean>
	getItemText: (item: unknown) => string
	emitLoading: (value: boolean) => void
	emitError: (error: unknown) => void
}

export function useSyAutocompleteFetch(options: UseSyAutocompleteFetchOptions) {
	const internalItems = ref<ItemType[]>([...options.items.value])
	const isLoading = ref(false)
	const cacheMap = ref(new Map<string, ItemType[]>())
	const requestId = ref(0)
	const debounceTimer = ref<number | null>(null)

	const syncItemsFromProps = (newItems: ItemType[]) => {
		internalItems.value = [...newItems]
	}

	const setLoading = (value: boolean) => {
		isLoading.value = value
		options.emitLoading(value)
	}

	const resetFetchState = () => {
		if (debounceTimer.value != null) {
			window.clearTimeout(debounceTimer.value)
			debounceTimer.value = null
		}
		requestId.value += 1
		setLoading(false)
		internalItems.value = [...options.items.value]
	}

	const performFetch = async (query: string) => {
		const trimmed = query.trim()
		if (trimmed.length < options.minChars.value) {
			internalItems.value = [...options.items.value]
			return
		}

		if (!options.fetchItems) {
			const normalizedQuery = trimmed.toLowerCase()
			internalItems.value = (options.items.value ?? []).filter((item) => {
				const itemTextValue = options.getItemText(item)
				const itemText = itemTextValue != null ? String(itemTextValue).toLowerCase() : ''
				if (!itemText) return false
				return itemText.includes(normalizedQuery)
			})
			return
		}

		if (options.cache.value && cacheMap.value.has(trimmed)) {
			internalItems.value = cacheMap.value.get(trimmed) ?? []
			return
		}

		const currentRequest = ++requestId.value
		setLoading(true)
		try {
			const result = await options.fetchItems(trimmed)
			if (currentRequest !== requestId.value) return
			internalItems.value = result
			if (options.cache.value) {
				cacheMap.value.set(trimmed, result)
			}
		}
		catch (error) {
			if (currentRequest !== requestId.value) return
			internalItems.value = []
			options.emitError(error)
		}
		finally {
			if (currentRequest === requestId.value) {
				setLoading(false)
			}
		}
	}

	const scheduleFetch = (query: string) => {
		if (options.debounceMs.value <= 0) {
			performFetch(query)
			return
		}

		if (debounceTimer.value != null) {
			window.clearTimeout(debounceTimer.value)
		}

		debounceTimer.value = window.setTimeout(() => {
			performFetch(query)
		}, options.debounceMs.value)
	}

	return {
		internalItems,
		isLoading,
		scheduleFetch,
		resetFetchState,
		syncItemsFromProps,
	}
}
