import { computed, ref, watch, type Ref } from 'vue'
import type { DataTableHeaders, TableColumnHeader } from './types'
import { sortHeaders } from './organizeColumns/sortHeaders'

/**
 * Composable for processing and enhancing table headers
 *
 * @param headersProp - Reference to headers from props
 * @param filterInputConfig - Configuration for filter inputs
 * @returns Header utilities and computed properties
 */
export function useTableHeaders({
	headersProp,
	storedHeaders,
	filterInputConfig = {},
}: {
	headersProp: Readonly<Ref<DataTableHeaders[] | undefined>>
	storedHeaders?: DataTableHeaders[]
	filterInputConfig?: Record<string, unknown>
}) {
	// Process headers to ensure they have title property
	const normalizedHeaders = computed(() => {
		const headers = storedHeaders ?? headersProp?.value
		if (!Array.isArray(headers)) {
			return undefined
		}
		return headers.map(header => ({
			...header,
			title: header.title ?? header.text,
		}))
	})

	// Get filterable headers
	const filterableHeaders = computed(() => {
		if (!normalizedHeaders.value) return []
		return normalizedHeaders.value.filter(header => header.filterable)
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

	// Mutable internal headers to manage state inside the component
	const internalHeaders = ref<DataTableHeaders[] | undefined>([])

	watch(normalizedHeaders, (newHeaders) => {
		// Update internal headers when props.headers changes
		internalHeaders.value = newHeaders
	}, { immediate: true, deep: true })

	/**
	 * Get header by key
	 */
	function getHeaderByKey(key: string): TableColumnHeader | undefined {
		return normalizedHeaders.value?.find(header => header.key === key)
	}

	/**
	 * The headers filtered by visibility and sorted by order
	 */
	const displayHeaders = computed(() => {
		if (!internalHeaders.value) return undefined
		const filteredHeaders = internalHeaders.value.filter(header => header.hidden !== true)
		return sortHeaders(filteredHeaders)
	})

	return {
		headers: internalHeaders,
		displayHeaders,
		filterableHeaders,
		getEnhancedHeader,
		getHeaderByKey,
	}
}
