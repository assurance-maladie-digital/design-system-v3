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
	function normalizeHeader(header: DataTableHeaders): DataTableHeaders {
		const mapped = {
			...header,
			title: header.title ?? header.text,
		} as TableColumnHeader

		// Si maxWidth est défini sans width → applique-le à width
		if (mapped.maxWidth != null && mapped.width == null) {
			mapped.width = mapped.maxWidth
		}

		// Si maxWidth est défini → l'appliquer aussi aux <td> via cellProps
		if (mapped.maxWidth != null) {
			const existingCellProps = (mapped.cellProps ?? {}) as Record<string, unknown>
			const existingStyle = (existingCellProps.style ?? {}) as Record<string, unknown>
			const multilineStyle = {
				...existingStyle,
				maxWidth: mapped.maxWidth,
				whiteSpace: 'normal',
				overflowWrap: 'anywhere',
				wordBreak: 'break-word',
			}
			const baseProps = { ...existingCellProps, style: multilineStyle }
			mapped.cellProps = () => ({
				...baseProps,
			})
		}

		return mapped as unknown as DataTableHeaders
	}

	const mergedHeaders = computed(() => {
		const incoming = headersProp?.value
		const stored = Array.isArray(storedHeaders) ? storedHeaders : undefined

		// Si aucun header, rien à faire
		if (!Array.isArray(incoming) && !Array.isArray(stored)) {
			return undefined
		}

		// Fusion logique entre storedHeaders et incoming
		let headers: DataTableHeaders[] = []

		if (stored && incoming) {
			// Fusionne les headers existants avec les nouveaux
			const merged = stored.map((storedHeader) => {
				const match = incoming.find(
					h =>
						(h.key && h.key === storedHeader.key)
						|| (h.value && h.value === storedHeader.value),
				)
				return {
					...storedHeader,
					...(match || {}), // les nouveaux props écrasent les anciens
				}
			})

			// Ajoute les headers qui n'existent pas encore dans le stockage
			const extras = incoming.filter(
				h =>
					!merged.some(
						x =>
							(x.key && x.key === h.key)
							|| (x.value && x.value === h.value),
					),
			)

			headers = [...merged, ...extras]
		}
		else {
			headers = (stored ?? incoming) as DataTableHeaders[]
		}

		return headers
	})

	// Process headers to ensure they have title property and regenerate cellProps after reordering
	const normalizedHeaders = computed(() => mergedHeaders.value?.map(normalizeHeader))

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

	const normalizedInternalHeaders = computed(() => internalHeaders.value?.map(normalizeHeader))

	// Get filterable headers
	const filterableHeaders = computed(() => {
		if (!normalizedInternalHeaders.value) return []
		return normalizedInternalHeaders.value.filter(header => header.filterable)
	})

	/**
	 * Get header by key
	 */
	function getHeaderByKey(key: string): TableColumnHeader | undefined {
		return normalizedInternalHeaders.value?.find(header => header.key === key)
	}

	/**
	 * Get original header from a rendered column (match by key or value)
	 */
	function getHeaderForColumn(column: TableColumnHeader): TableColumnHeader | undefined {
		if (!normalizedInternalHeaders.value) return undefined
		const key = column.key ?? undefined
		if (key) {
			const byKey = normalizedInternalHeaders.value.find(h => h.key === key)
			if (byKey) return byKey
		}
		// Fallback: try matching by value when key is not present or didn't match
		const val = typeof column.value === 'string' ? column.value : undefined
		if (val) {
			const byValue = normalizedInternalHeaders.value.find(h => h.value === val)
			if (byValue) return byValue
		}
		return undefined
	}

	/**
	 * The headers filtered by visibility and sorted by order
	 */
	const displayHeaders = computed(() => {
		if (!normalizedInternalHeaders.value) return undefined
		const filteredHeaders = normalizedInternalHeaders.value.filter(header => header.hidden !== true)
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
