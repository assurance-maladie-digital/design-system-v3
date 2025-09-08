import { computed, type Ref } from 'vue'
import type { DataOptions } from './types'

/**
 * Crée et renvoie des fonctionnalités communes pour les tableaux
 */
export function useTableUtils({
	serverItemsLength,
	componentAttributes,
	options,
	storedOptions,
}: {
	serverItemsLength?: number
	componentAttributes: Record<string, unknown>
	options: Ref<Partial<DataOptions>>
	storedOptions?: Partial<DataOptions>
}) {
	const propsFacade = computed(() => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { 'onUpdate:options': _, ...attrs } = componentAttributes

		const props = {
			...attrs,
			...storedOptions || options.value,
			...(serverItemsLength !== undefined ? { itemsLength: serverItemsLength } : {}),
		}

		// Ajoute itemsLength uniquement pour les tableaux côté serveur
		if (serverItemsLength !== undefined) {
			props.itemsLength = serverItemsLength
		}

		return props
	})

	function updateOptions(tableOptions: Partial<DataOptions>): void {
		options.value = {
			...options.value,
			...tableOptions,
		}
	}

	return {
		propsFacade,
		updateOptions,
	}
}
