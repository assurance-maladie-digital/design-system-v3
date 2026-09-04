import { computed, type Ref } from 'vue'
import type { DataOptions } from './types'

/**
 * Composable for managing table pagination
 *
 * `options` est l'unique source de vérité de la pagination : le pied de tableau
 * (`SyTablePagination`) et le tableau Vuetify interne lisent tous les deux
 * `options.page` / `options.itemsPerPage`. Les composants branchent
 * `@update:page` et `@update:items-per-page` sur le tableau Vuetify pour que
 * `useProxiedModel` fonctionne en mode « contrôlé » : sans ces écouteurs,
 * Vuetify conserve une copie interne qui peut diverger durablement de
 * `options` (pied affichant 300 lignes/page alors que le tableau en pagine 10).
 *
 * @param options - Reactive reference to table options
 * @param itemsLength - Total number of items (for client-side) or serverItemsLength (for server-side)
 * @returns Pagination utilities and computed properties
 */
export function usePagination({
	options,
	itemsLength,
	updateOptions,
}: {
	options: Ref<Partial<DataOptions>>
	itemsLength: Ref<number>
	updateOptions: (opts: Partial<DataOptions>) => void
}) {
	// Page courante, avec valeur par défaut. Lecture seule : toute écriture passe
	// par `updateOptions`, `options` étant l'unique source de vérité.
	const page = computed(() => options.value.page || 1)

	// Items per page with fallback to default
	const itemsPerPageValue = computed(() => {
		const value = options.value.itemsPerPage || 10
		// If value is -1, it means "Tous" (all items)
		return value
	})

	// Calculate total number of pages
	const pageCount = computed(() => {
		if (!itemsLength.value) return 0
		// If itemsPerPageValue is -1 ("Tous"), return 1 page
		if (itemsPerPageValue.value === -1) return 1
		return Math.ceil(itemsLength.value / itemsPerPageValue.value)
	})

	/**
   * Update items per page from pagination component
   */
	function updateItemsPerPage(newItemsPerPage: number) {
		updateOptions({
			itemsPerPage: newItemsPerPage,
			page: 1, // Reset to first page when changing items per page
		})
	}

	return {
		page,
		pageCount,
		itemsPerPageValue,
		updateItemsPerPage,
	}
}
