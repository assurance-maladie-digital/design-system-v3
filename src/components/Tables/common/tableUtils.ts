import { computed, watch, type Ref } from 'vue'
import type { DataOptions, TableDensityType } from './types'
import { useTableAccessibility } from './tableAccessibilityUtils'
import { useTableStorage } from './tableStorageUtils'

/**
 * Crée et renvoie des fonctionnalités communes pour les tableaux
 */
export function useTableUtils({
	tableId,
	prefix,
	suffix,
	itemsPerPage,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	caption,
	serverItemsLength,
	componentAttributes,
	options,
}: {
	tableId: string
	prefix: string
	suffix?: string
	itemsPerPage?: number
	caption?: string
	serverItemsLength?: number
	componentAttributes: Record<string, unknown>
	options: Ref<Partial<DataOptions>>
	density?: TableDensityType
}) {
	// Use the separated storage utility
	const { localOptions, storageKey, setupLocalStorage } = useTableStorage({
		prefix,
		suffix,
		serverItemsLength,
		options,
	})

	// Use the separated accessibility utility
	const { setupAccessibility } = useTableAccessibility({
		tableId,
	})

	const headers = computed(() => {
		if (!Array.isArray(componentAttributes['headers'])) {
			return undefined
		}
		return componentAttributes['headers'].map(header => ({
			...header,
			title: header.title ?? header.text,
		}))
	})

	const optionsFacade = computed(() => {
		return {
			page: options.value.page || componentAttributes['page'],
			itemsPerPage: options.value.itemsPerPage || itemsPerPage,
			sortBy: options.value.sortBy,
			groupBy: options.value.groupBy,
			multiSort: options.value.multiSort,
			mustSort: options.value.mustSort,
		}
	})

	const propsFacade = computed(() => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { 'onUpdate:options': _, ...attrs } = componentAttributes

		const props = {
			...attrs,
			headers: headers.value,
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
		storageKey,
		headers,
		optionsFacade,
		propsFacade,
		updateOptions,
		setupAccessibility,
		setupLocalStorage,
	}
}
