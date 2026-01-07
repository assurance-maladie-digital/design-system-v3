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
	// Liste réellement affichée dans le menu.
	// - Si fetchItems est défini: alimentée par le résultat API.
	// - Sinon: filtrage local sur options.items.
	const internalItems = ref<ItemType[]>([...options.items.value])
	// État de chargement (sert aussi à afficher "Chargement..." dans la liste)
	const isLoading = ref(false)
	// Cache simple par requête (query -> items). Activé uniquement si options.cache.
	const cacheMap = ref(new Map<string, ItemType[]>())
	// Incrémenté à chaque requête. Permet le comportement "last request wins".
	const requestId = ref(0)
	// Timer de debounce (setTimeout) pour ne pas appeler fetchItems à chaque frappe.
	const debounceTimer = ref<number | null>(null)

	const syncItemsFromProps = (newItems: ItemType[]) => {
		internalItems.value = [...newItems]
	}

	const setLoading = (value: boolean) => {
		isLoading.value = value
		options.emitLoading(value)
	}

	const resetFetchState = () => {
		// Annule le debounce en cours + invalide les requêtes précédentes.
		if (debounceTimer.value != null) {
			window.clearTimeout(debounceTimer.value)
			debounceTimer.value = null
		}
		requestId.value += 1
		setLoading(false)
		// On revient aux items passés en props (cas: suppression de la recherche, etc.).
		internalItems.value = [...options.items.value]
	}

	const performFetch = async (query: string) => {
		const trimmed = query.trim()
		// Si la recherche est trop courte, on ne fetch pas et on affiche les items de base.
		if (trimmed.length < options.minChars.value) {
			internalItems.value = [...options.items.value]
			return
		}

		// Sans fetchItems: filtrage local (comportement historique conservé).
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

		// Cache (optionnel)
		if (options.cache.value && cacheMap.value.has(trimmed)) {
			internalItems.value = cacheMap.value.get(trimmed) ?? []
			return
		}

		// Marqueur de requête: seule la dernière réponse doit mettre à jour internalItems.
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
