import { ref, shallowRef, type Ref } from 'vue'
import type { Item } from './types'

interface UseTableEditingParams {
	/**
	 * Fonction d'identité de ligne (réutilise celle de la sélection :
	 * selectionKey, puis `id`, puis l'objet lui-même).
	 */
	getItemValue: (item: Item) => unknown
}

interface UseTableEditingReturn {
	/** Clé de la ligne en cours d'édition (`null` si aucune). */
	editingKey: Ref<unknown>
	/** Brouillon de la ligne éditée (copie, la prop `items` n'est jamais mutée). */
	draft: Ref<Item>
	/** Indique si l'item passé est la ligne actuellement éditée. */
	isRowEditing: (item: Item) => boolean
	/** Démarre l'édition d'une ligne (une seule à la fois en V1). */
	startEditing: (item: Item) => void
	/** Met à jour un champ du brouillon. */
	setDraftField: (key: string, value: unknown) => void
	/** Valide l'édition et renvoie l'item modifié + l'original. */
	saveEditing: () => { updated: Item, original: Item | null }
	/** Annule l'édition et renvoie l'item original. */
	cancelEditing: () => Item | null
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
	const draft = ref<Item>({})
	const originalItem = shallowRef<Item | null>(null)

	function isRowEditing(item: Item): boolean {
		return editingKey.value !== null && getItemValue(item) === editingKey.value
	}

	function startEditing(item: Item): void {
		editingKey.value = getItemValue(item)
		originalItem.value = item
		draft.value = { ...item }
	}

	function setDraftField(key: string, value: unknown): void {
		draft.value[key] = value
	}

	function saveEditing(): { updated: Item, original: Item | null } {
		const original = originalItem.value
		const updated = { ...(original ?? {}), ...draft.value }
		resetEditing()
		return { updated, original }
	}

	function cancelEditing(): Item | null {
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
