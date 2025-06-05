import { computed, ref, type Ref } from 'vue'
import type { DataOptions } from './types'
import { LocalStorageUtility } from '@/utils/localStorageUtility'

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
		}

		return { watchOptions, initFromStorage }
	}

	return {
		localOptions,
		storageKey,
		setupLocalStorage,
	}
}
