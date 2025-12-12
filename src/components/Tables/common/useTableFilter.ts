import { inject } from 'vue'
import type { FilterOption, Items } from './types'
import { filterItems as filterItemsUtil } from './tableFilterUtils'

/**
 * Composable pour utiliser les fonctionnalités de filtrage de tableau
 *
 * @returns Objet contenant les fonctions utilitaires de filtrage
 */
export function useTableFilter() {
	// Récupère la fonction filterItems du modèle provide/inject
	const filterItems = inject<
		<T extends Items[0]>(items: T[], filters: FilterOption[]) => T[]
	>('filterItems', filterItemsUtil)

	return {
		filterItems,
	}
}
