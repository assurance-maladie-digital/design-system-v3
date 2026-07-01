import { computed, type ComputedRef, type Ref } from 'vue'
import type { Item, Items } from './types'

interface UseTableBulkActionsParams {
	/** Liste des lignes affichées (filtrées). */
	items: Ref<Items> | ComputedRef<Items>
	/** Sélection (v-model) : tableau des valeurs de ligne (clés ou objets). */
	model: Ref<unknown[]>
	/** Fonction d'identité de ligne, partagée avec la sélection. */
	getItemValue: (item: Item) => unknown
}

interface UseTableBulkActionsReturn {
	/** Lignes sélectionnées, résolues en objets complets. */
	selectedItems: ComputedRef<Item[]>
	/** Vide la sélection. */
	clearSelection: () => void
}

/**
 * Résout la sélection multiple des tableaux du DS : transforme le `v-model`
 * (qui ne contient que des clés/valeurs de ligne) en objets de ligne complets,
 * et fournit l'effacement de la sélection.
 *
 * Les actions groupées elles-mêmes (édition, suppression…) sont **laissées à la
 * charge du projet consommateur** via le slot `#bulk-actions`.
 */
export function useTableBulkActions({
	items,
	model,
	getItemValue,
}: UseTableBulkActionsParams): UseTableBulkActionsReturn {
	const selectedItems = computed<Item[]>(() => {
		const keys = model.value ?? []
		if (keys.length === 0) {
			return []
		}
		return items.value.filter(item => keys.includes(getItemValue(item)))
	})

	function clearSelection(): void {
		model.value = []
	}

	return {
		selectedItems,
		clearSelection,
	}
}
