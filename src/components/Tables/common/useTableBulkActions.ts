import { computed, type ComputedRef, type Ref } from 'vue'
import type { Items } from './types'

interface UseTableBulkActionsParams {
	/** Liste des lignes affichées (filtrées). */
	items: Ref<Items> | ComputedRef<Items>
	/** Sélection (v-model) : tableau des valeurs de ligne (clés ou objets). */
	model: Ref<unknown[]>
	/** Fonction d'identité de ligne, partagée avec la sélection. */
	getItemValue: (item: Items[number]) => unknown
}

interface UseTableBulkActionsReturn {
	/** Lignes sélectionnées, résolues en objets complets. */
	selectedItems: ComputedRef<Record<string, unknown>[]>
	/** Vide la sélection. */
	clearSelection: () => void
}

/**
 * Logique des actions groupées (suppression en masse) des tableaux du DS.
 *
 * Résout la sélection (`v-model`, qui ne contient que des clés/valeurs de ligne)
 * en objets complets pour les remonter au parent, et fournit un utilitaire de
 * désélection.
 */
export function useTableBulkActions({
	items,
	model,
	getItemValue,
}: UseTableBulkActionsParams): UseTableBulkActionsReturn {
	const selectedItems = computed<Record<string, unknown>[]>(() => {
		const keys = model.value ?? []
		if (keys.length === 0) {
			return []
		}
		return items.value.filter(item => keys.includes(getItemValue(item))) as Record<string, unknown>[]
	})

	function clearSelection(): void {
		model.value = []
	}

	return {
		selectedItems,
		clearSelection,
	}
}
