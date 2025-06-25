import { computed, type Ref } from 'vue'
import type { DataTableHeaders, TableColumnHeader } from './types'

/**
 * Composable for processing and enhancing table headers
 *
 * @param headersProp - Reference to headers from props
 * @param filterInputConfig - Configuration for filter inputs
 * @returns Header utilities and computed properties
 */
export function useTableHeaders({
	headersProp,
	filterInputConfig = {},
}: {
	headersProp: Ref<DataTableHeaders[] | undefined>
	filterInputConfig?: Record<string, unknown>
}) {
	// Process headers to ensure they have title property
	const headers = computed(() => {
		if (!Array.isArray(headersProp?.value)) {
			return undefined
		}
		return headersProp.value.map(header => ({
			...header,
			title: header.title ?? header.text,
		}))
	})

	// Get filterable headers
	const filterableHeaders = computed(() => {
		if (!headers.value) return []
		return headers.value.filter(header => header.filterable)
	})

	/**
   * Enhance header with filter type and configuration
   */
	function getEnhancedHeader(column: TableColumnHeader): TableColumnHeader {
		// If column is not filterable, return as is
		if (!column.filterable) return column

		// Default filter type is 'text' if not specified
		const filterType = column.filterType || 'text'

		// Get column-specific filter config or empty object
		const columnFilterConfig = column.key && filterInputConfig[column.key as string] ? filterInputConfig[column.key as string] : {}

		// Return enhanced header with filter properties
		return {
			...(column as object),
			filterType,
			filterConfig: columnFilterConfig as Record<string, unknown>,
		} as TableColumnHeader
	}

	/**
   * Get header by key
   */
	function getHeaderByKey(key: string): TableColumnHeader | undefined {
		return headers.value?.find(header => header.key === key)
	}

	return {
		headers,
		filterableHeaders,
		getEnhancedHeader,
		getHeaderByKey,
	}
}
