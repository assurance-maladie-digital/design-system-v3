import { ref, shallowRef, type Ref } from 'vue'

interface UseTableEditingParams {
	/**
	 * Fonction d'identité de ligne (réutilise celle de la sélection :
	 * selectionKey, puis `id`, puis l'objet lui-même).
	 */
	getItemValue: (item: unknown) => unknown
}

interface UseTableEditingReturn {
	/** Clé de la ligne en cours d'édition (`null` si aucune). */
	editingKey: Ref<unknown>
	/** Brouillon de la ligne éditée (copie, la prop `items` n'est jamais mutée). */
	draft: Ref<Record<string, unknown>>
	/** Indique si l'item passé est la ligne actuellement éditée. */
	isRowEditing: (item: unknown) => boolean
	/** Démarre l'édition d'une ligne (une seule à la fois en V1). */
	startEditing: (item: Record<string, unknown>) => void
	/** Met à jour un champ du brouillon. */
	setDraftField: (key: string, value: unknown) => void
	/** Valide l'édition et renvoie l'item modifié + l'original. */
	saveEditing: () => { updated: Record<string, unknown>, original: Record<string, unknown> | null }
	/** Annule l'édition et renvoie l'item original. */
	cancelEditing: () => Record<string, unknown> | null
	/** Réinitialise l'état d'édition. */
	resetEditing: () => void
}

/**
 * Moteur d'édition inline d'une ligne pour les tableaux du DS.
 *
 * Ne mute jamais les données d'origine : il travaille sur un brouillon et
 * renvoie l'item modifié au composant, à charge pour l'application parente
 * de persister via l'évènement `@save`.
 */
export function useTableEditing({ getItemValue }: UseTableEditingParams): UseTableEditingReturn {
	// `shallowRef` : on conserve la valeur brute (clé d'identité et item original)
	// sans la transformer en proxy réactif, sinon les comparaisons par référence
	// (`===`) échoueraient pour une identité de ligne basée sur l'objet lui-même.
	const editingKey = shallowRef<unknown>(null)
	const draft = ref<Record<string, unknown>>({})
	const originalItem = shallowRef<Record<string, unknown> | null>(null)

	function isRowEditing(item: unknown): boolean {
		return editingKey.value !== null && getItemValue(item) === editingKey.value
	}

	function startEditing(item: Record<string, unknown>): void {
		editingKey.value = getItemValue(item)
		originalItem.value = item
		draft.value = { ...item }
	}

	function setDraftField(key: string, value: unknown): void {
		draft.value[key] = value
	}

	function saveEditing(): { updated: Record<string, unknown>, original: Record<string, unknown> | null } {
		const original = originalItem.value
		const updated = { ...(original ?? {}), ...draft.value }
		resetEditing()
		return { updated, original }
	}

	function cancelEditing(): Record<string, unknown> | null {
		const original = originalItem.value
		resetEditing()
		return original
	}

	function resetEditing(): void {
		editingKey.value = null
		draft.value = {}
		originalItem.value = null
	}

	return {
		editingKey,
		draft,
		isRowEditing,
		startEditing,
		setDraftField,
		saveEditing,
		cancelEditing,
		resetEditing,
	}
}
