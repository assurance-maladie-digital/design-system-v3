import { computed, watch, type Ref } from 'vue'
import type { DataOptions } from './types'
import { useTableStorage } from './tableStorageUtils'

/**
 * Crée et renvoie des fonctionnalités communes pour les tableaux
 */
export function useTableUtils({
	prefix,
	suffix,
	itemsPerPage,
	serverItemsLength,
	defaultAttrs,
	options,
}: {
	prefix: string
	suffix?: string
	itemsPerPage?: number
	serverItemsLength?: number
	defaultAttrs: Record<string, unknown>
	options: Ref<Partial<DataOptions>>
}) {
	// Use the separated storage utility
	const { localOptions, columnWidths, storageKey, setupLocalStorage, updateColumnWidth } = useTableStorage({
		prefix,
		suffix,
		serverItemsLength,
		options,
	})

	const optionsFacade = computed(() => {
		return {
			page: options.value.page || defaultAttrs['page'],
			itemsPerPage: options.value.itemsPerPage || itemsPerPage,
			sortBy: options.value.sortBy,
			groupBy: options.value.groupBy,
			multiSort: options.value.multiSort,
			mustSort: options.value.mustSort,
		}
	})

	const propsFacade = computed(() => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { 'onUpdate:options': _, ...attrs } = defaultAttrs

		const props = {
			...attrs,
			...localOptions.value,
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

	// Accessibility setup is now handled by the imported utility

	// Storage setup is now handled by the imported utility
	const { watchOptions, initFromStorage } = setupLocalStorage()

	// Initialize local options from storage or default values
	initFromStorage(optionsFacade.value)

	// Watch for options changes
	watch(
		() => options.value,
		watchOptions,
		{ deep: true },
	)

	return {
		localOptions,
		columnWidths,
		storageKey,
		optionsFacade,
		propsFacade,
		updateOptions,
		setupLocalStorage,
		updateColumnWidth,
	}
}
