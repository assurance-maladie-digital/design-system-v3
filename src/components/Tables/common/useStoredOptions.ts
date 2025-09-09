import { toValue, type Ref } from 'vue'
import type { DataOptions, DataTableHeaders } from './types'
import { LocalStorageUtility } from '@/utils'

export type TableOptions = {
	options?: Partial<DataOptions>
	headers?: DataTableHeaders[]
	columnWidths?: Record<string, number | string>
}

export default function useStoredOptions({
	key,
	saveState,
}: {
	key: Ref<string>
	saveState: Ref<boolean>
}): {
		storedOptions: TableOptions
		storeOptions: (options: TableOptions) => void
	} {
	const localStorageUtility = new LocalStorageUtility()

	const storedOptions: TableOptions
		= (saveState.value ? localStorageUtility.getItem(toValue(key)) : {}) || {}

	function storeOptions(options: TableOptions): void {
		if (saveState.value) {
			localStorageUtility.setItem(toValue(key), options)
		}
	}

	return {
		storedOptions,
		storeOptions,
	}
}
