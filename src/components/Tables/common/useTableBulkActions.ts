import { computed, ref, shallowRef, type ComputedRef, type Ref } from 'vue'
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
	/** Index de la ligne en cours d'édition (édition séquentielle). */
	bulkEditIndex: Ref<number>
	/** Nombre de lignes à éditer. */
	bulkEditCount: ComputedRef<number>
	/** Brouillon de la ligne actuellement éditée. */
	currentBulkDraft: ComputedRef<Item>
	/** Met à jour un champ de la ligne en cours d'édition. */
	setBulkField: (key: string, value: unknown) => void
	/** Passe à la ligne précédente. */
	bulkPrev: () => void
	/** Passe à la ligne suivante. */
	bulkNext: () => void
	/**
	 * Initialise l'édition séquentielle : un brouillon (copie) par ligne
	 * sélectionnée, positionné sur la première.
	 */
	initBulkEdit: () => void
	/** Réinitialise l'état d'édition groupée. */
	resetBulkEdit: () => void
	/** Renvoie les lignes dont le brouillon a été modifié (objets complets). */
	collectEditedItems: () => Item[]
}

/**
 * Logique des actions groupées des tableaux du DS : suppression en masse et
 * édition séquentielle des lignes sélectionnées.
 *
 * Résout la sélection (`v-model`, qui ne contient que des clés/valeurs de ligne)
 * en objets complets. L'édition groupée travaille sur une **copie** de chaque
 * ligne ; chaque ligne est éditée indépendamment et seules les lignes réellement
 * modifiées sont renvoyées au parent.
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

	// --- Édition séquentielle des lignes sélectionnées -----------------------
	const bulkEditIndex = ref(0)
	// Un brouillon (copie indépendante) par ligne sélectionnée
	const bulkDrafts = ref<Item[]>([])
	// Références des lignes d'origine, pour détecter les modifications
	const bulkOriginals = shallowRef<Item[]>([])

	const bulkEditCount = computed<number>(() => bulkDrafts.value.length)

	const currentBulkDraft = computed<Item>(
		() => bulkDrafts.value[bulkEditIndex.value] ?? {},
	)

	function setBulkField(key: string, value: unknown): void {
		const draft = bulkDrafts.value[bulkEditIndex.value]
		if (draft) {
			draft[key] = value
		}
	}

	function bulkPrev(): void {
		if (bulkEditIndex.value > 0) {
			bulkEditIndex.value--
		}
	}

	function bulkNext(): void {
		if (bulkEditIndex.value < bulkDrafts.value.length - 1) {
			bulkEditIndex.value++
		}
	}

	function initBulkEdit(): void {
		const rows = selectedItems.value
		bulkOriginals.value = rows
		// Copie superficielle de chaque ligne (édition indépendante)
		bulkDrafts.value = rows.map(row => ({ ...row }))
		bulkEditIndex.value = 0
	}

	function resetBulkEdit(): void {
		bulkDrafts.value = []
		bulkOriginals.value = []
		bulkEditIndex.value = 0
	}

	function collectEditedItems(): Item[] {
		return bulkDrafts.value.filter((draft, index) => {
			const original = bulkOriginals.value[index]
			return original !== undefined && Object.keys(draft).some(key => draft[key] !== original[key])
		})
	}

	return {
		selectedItems,
		clearSelection,
		bulkEditIndex,
		bulkEditCount,
		currentBulkDraft,
		setBulkField,
		bulkPrev,
		bulkNext,
		initBulkEdit,
		resetBulkEdit,
		collectEditedItems,
	}
}
