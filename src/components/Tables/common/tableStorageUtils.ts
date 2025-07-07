import { computed, ref, type Ref } from 'vue'
import type { DataOptions, DataTableHeaders } from './types'
import { LocalStorageUtility } from '@/utils/localStorageUtility'

/**
 * Interface for column width storage
 */
export interface ColumnWidthsStorage {
	[key: string]: number | string
}

/**
 * Utility function to manage table state persistence in local storage
 */
export function useTableStorage({
	prefix,
	suffix,
	serverItemsLength,
	options,
}: {
	prefix: string
	suffix?: string
	serverItemsLength?: number
	options: Ref<Partial<DataOptions>>
}) {
	const localStorageUtility = new LocalStorageUtility()
	const localOptions = ref({})

	const storageKey = computed(() => {
		return suffix ? `${prefix}-${suffix}` : prefix
	})

	// Separate key for column widths
	const columnWidthsKey = computed(() => {
		return `${storageKey.value}-column-widths`
	})

	// Separate key for headers
	const heardersKey = computed(() => {
		return `${storageKey.value}-headers`
	})

	// Column widths storage
	const columnWidths = ref<ColumnWidthsStorage>({})

	// Headers storage
	const headers = ref<DataTableHeaders[] | undefined>(undefined)

	// Configuration of local storage synchronization
	function setupLocalStorage() {
		// Watch for option changes and update local storage
		const watchOptions = () => {
			const storageData = {
				...(options.value as Record<string, unknown>),
			}

			// Add itemsLength only for server-side tables
			if (serverItemsLength !== undefined) {
				storageData.itemsLength = serverItemsLength
			}

			localStorageUtility.setItem(storageKey.value, storageData)
			localOptions.value = options.value
		}

		// Initialize local options from storage or default values
		const initFromStorage = (defaultOptions: Record<string, unknown>) => {
			localOptions.value = localStorageUtility.getItem(storageKey.value) ?? defaultOptions

			// Load column widths from storage
			const storedColumnWidths = localStorageUtility.getItem<ColumnWidthsStorage>(columnWidthsKey.value)
			if (storedColumnWidths) {
				columnWidths.value = storedColumnWidths
			}

			// Load headers from storage
			const storedHeaders = localStorageUtility.getItem<DataTableHeaders[]>(heardersKey.value)
			if (storedHeaders) {
				headers.value = storedHeaders
			}
		}

		// Save column widths to localStorage
		const saveColumnWidths = (widths: ColumnWidthsStorage) => {
			columnWidths.value = widths
			localStorageUtility.setItem(columnWidthsKey.value, widths)
		}

		// Update a single column width
		const updateColumnWidth = (columnKey: string, width: number | string) => {
			const updatedWidths = {
				...columnWidths.value,
				[columnKey]: width,
			}
			saveColumnWidths(updatedWidths)
		}

		// Save headers to localStorage
		const saveHeaders = (headers: DataTableHeaders[] | undefined) => {
			if (!headers) {
				localStorageUtility.removeItem(heardersKey.value)
				return
			}

			localStorageUtility.setItem(heardersKey.value, headers)
		}

		return { watchOptions, initFromStorage, saveColumnWidths, updateColumnWidth, saveHeaders }
	}

	return {
		localOptions,
		columnWidths,
		headers,
		storageKey,
		columnWidthsKey,
		setupLocalStorage,
		updateColumnWidth: (key: string, width: number | string) => {
			const updatedWidths = {
				...columnWidths.value,
				[key]: width,
			}
			columnWidths.value = updatedWidths
			localStorageUtility.setItem(columnWidthsKey.value, updatedWidths)
		},
	}
}
