import { computed, toValue, type ComputedRef, type MaybeRefOrGetter, type Ref } from 'vue'
import type { Item, Items } from './types'

interface UseTableBulkActionsParams {
	/** Liste des lignes affichées (filtrées). */
	items: Ref<Items> | ComputedRef<Items>
	/** Sélection (v-model) : tableau des valeurs de ligne (clés ou objets). */
	model: Ref<unknown[]>
	/** Fonction d'identité de ligne, partagée avec la sélection. */
	getItemValue: (item: Item) => unknown
	/** Prop `showSelect` du tableau (la barre nécessite la sélection). */
	showSelect?: MaybeRefOrGetter<boolean>
	/** Indique si un slot `#bulk-actions` est fourni par le consommateur. */
	hasBulkActionsSlot?: MaybeRefOrGetter<boolean>
}

interface UseTableBulkActionsReturn {
	/** Lignes sélectionnées, résolues en objets complets. */
	selectedItems: ComputedRef<Item[]>
	/** Vide la sélection. */
	clearSelection: () => void
	/**
	 * Affiche la barre d'actions groupées : sélection activée, au moins une
	 * ligne cochée et un slot `#bulk-actions` fourni par le projet.
	 */
	showBulkActions: ComputedRef<boolean>
}

/**
 * Résout la sélection multiple des tableaux du DS : transforme le `v-model`
 * (qui ne contient que des clés/valeurs de ligne) en objets de ligne complets,
 * fournit l'effacement de la sélection et la visibilité de la barre.
 *
 * Les actions groupées elles-mêmes (édition, suppression…) sont **laissées à la
 * charge du projet consommateur** via le slot `#bulk-actions`.
 */
export function useTableBulkActions({
	items,
	model,
	getItemValue,
	showSelect,
	hasBulkActionsSlot,
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

	// La barre s'affiche dès qu'au moins une ligne est sélectionnée et qu'un
	// slot `#bulk-actions` fournit les actions.
	const showBulkActions = computed<boolean>(() =>
		toValue(showSelect) === true
		&& selectedItems.value.length > 0
		&& toValue(hasBulkActionsSlot) === true,
	)

	return {
		selectedItems,
		clearSelection,
		showBulkActions,
	}
}
