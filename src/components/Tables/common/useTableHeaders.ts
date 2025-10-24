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
		const incoming = headersProp?.value
		let headers: DataTableHeaders[] | undefined
		if (Array.isArray(storedHeaders) && Array.isArray(incoming)) {
			// Merge by key/value so new props override stored while keeping stored order/hidden
			const merged = storedHeaders.map((sh) => {
				const match = incoming.find(h => (h.key && h.key === sh.key) || (h.value && h.value === sh.value))
				return {
					...sh,
					...(match || {}),
				} as DataTableHeaders
			})
			// Add any new headers not present in storage
			const extras = incoming.filter(h => !merged.some(x => (x.key && x.key === h.key) || (x.value && x.value === h.value)))
			headers = [...merged, ...extras]
		}
		else {
			headers = (storedHeaders ?? incoming) as DataTableHeaders[] | undefined
		}
		if (!Array.isArray(headers)) {
			return undefined
		}
		return headers.map((header) => {
			const mapped = {
				...header,
				title: header.title ?? header.text,
			} as unknown as TableColumnHeader
			// If a header defines maxWidth but not width, map it to width so Vuetify enforces the column size
			if (mapped.maxWidth != null && mapped.width == null) {
				mapped.width = mapped.maxWidth
			}
			return mapped as unknown as DataTableHeaders
		})
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
	 * Get original header from a rendered column (match by key or value)
	 */
	function getHeaderForColumn(column: TableColumnHeader): TableColumnHeader | undefined {
		if (!normalizedHeaders.value) return undefined
		const key = column.key as string | undefined
		if (key) {
			const byKey = normalizedHeaders.value.find(h => h.key === key)
			if (byKey) return byKey
		}
		// Fallback: try matching by value when key is not present or didn’t match
		const val = column.value as string | undefined
		if (val) {
			const byValue = normalizedHeaders.value.find(h => h.value === val)
			if (byValue) return byValue
		}
		return undefined
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
		getHeaderForColumn,
	}
}
