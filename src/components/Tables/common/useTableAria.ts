import { computed, nextTick, onMounted, ref, watch, type Ref } from 'vue'
import type { VDataTable, VDataTableServer } from 'vuetify/components'
import { locales } from './locales'
import type { DataOptions } from './types'

export interface UseTableAriaOptions {
	table: Ref<VDataTable | VDataTableServer | undefined>
	items: Ref<unknown[]>
	totalItemsCount: Ref<number>
	options: Ref<Partial<DataOptions>>
	uniqueTableId: string
}

export function useTableAria({
	table,
	items,
	totalItemsCount,
	options,
	uniqueTableId,
}: UseTableAriaOptions) {
	const statusRegionId = `${uniqueTableId}-status`
	const statusMessage = ref('')

	// Calculate the total row count including header rows
	const totalRowCount = computed(() => {
		// Add 1 for the main header row
		let headerRows = 1

		// Add 1 if filters are shown (filter row)
		if (table.value?.$el?.querySelector('.filters')) {
			headerRows++
		}

		// Add 1 if reset filter row is shown
		if (table.value?.$el?.querySelector('.reset')) {
			headerRows++
		}

		return totalItemsCount.value + headerRows
	})

	// Get the current sort state for aria-sort attribute
	const getSortState = (columnKey: string): 'ascending' | 'descending' | 'other' | 'none' => {
		const sortBy = options.value.sortBy
		if (!sortBy || sortBy.length === 0) {
			return 'none'
		}

		const sortItem = sortBy.find(item => item.key === columnKey)
		if (!sortItem) {
			return 'none'
		}

		if (sortItem.order === 'asc') {
			return 'ascending'
		}
		else if (sortItem.order === 'desc') {
			return 'descending'
		}
		else {
			return 'other'
		}
	}

	// Update ARIA attributes on the table element
	const updateTableAria = async () => {
		await nextTick()

		const tableElement = table.value?.$el?.querySelector('table')
		if (tableElement) {
			tableElement.setAttribute('aria-rowcount', totalRowCount.value.toString())
		}
	}

	// Update ARIA attributes on table rows
	const updateRowAria = async () => {
		await nextTick()

		const tableElement = table.value?.$el?.querySelector('table')
		if (!tableElement) return

		// Update header rows
		const headerRows = tableElement.querySelectorAll('thead tr')
		headerRows.forEach((row, index) => {
			row.setAttribute('aria-rowindex', (index + 1).toString())
		})

		// Update data rows - only visible/filtered rows should be counted
		const dataRows = tableElement.querySelectorAll('tbody tr')
		let rowIndex = headerRows.length + 1 // Start after header rows

		dataRows.forEach((row) => {
			// Skip empty state rows (no data message)
			if (row.querySelector('td[colspan]')) {
				// Remove aria-rowindex from empty state rows
				row.removeAttribute('aria-rowindex')
				return
			}

			// Skip hidden rows (display: none or visibility: hidden)
			const computedStyle = window.getComputedStyle(row)
			if (computedStyle.display === 'none' || computedStyle.visibility === 'hidden') {
				row.removeAttribute('aria-rowindex')
				return
			}

			// Only assign aria-rowindex to visible data rows
			row.setAttribute('aria-rowindex', rowIndex.toString())
			rowIndex++
		})
	}

	// Update ARIA sort attributes on header cells
	const updateHeaderAria = async () => {
		await nextTick()

		const tableElement = table.value?.$el?.querySelector('table')
		if (!tableElement) return

		const headerCells = tableElement.querySelectorAll('thead tr.headers th')
		headerCells.forEach((cell) => {
			// Try to find column key from various sources
			let columnKey = null

			// Look for sort button or column identifier
			const sortButton = cell.querySelector('button[data-column-key], .sortable[data-column-key]')
			if (sortButton) {
				columnKey = sortButton.getAttribute('data-column-key')
			}

			// Fallback: look for any element with data-column-key
			if (!columnKey) {
				const columnElement = cell.querySelector('[data-column-key]')
				columnKey = columnElement?.getAttribute('data-column-key')
			}

			// If we found a column key, set the sort state
			if (columnKey) {
				const sortState = getSortState(columnKey)
				cell.setAttribute('aria-sort', sortState)
			}
			else {
				// Default to 'none' if no column key found
				cell.setAttribute('aria-sort', 'none')
			}

			// Handle accessibility for header cell interactive elements
			// Only apply to non-checkbox columns
			if (!cell.querySelector('input[type="checkbox"]')) {
				const interactiveElements = cell.querySelectorAll('button, [tabindex]:not([tabindex="-1"])')

				// Remove existing event listeners to avoid duplicates
				interactiveElements.forEach((element) => {
					element.removeEventListener('focus', handleInteractiveElementFocus)
					element.removeEventListener('blur', handleInteractiveElementBlur)
				})

				interactiveElements.forEach((element, index) => {
					if (index === 0) {
						// First interactive element (usually the sort button) should be accessible
						element.removeAttribute('aria-hidden')
					}
					else {
						// Other elements should be hidden initially
						element.setAttribute('aria-hidden', 'true')
					}

					// Add event listeners
					element.addEventListener('focus', handleInteractiveElementFocus)
					element.addEventListener('blur', handleInteractiveElementBlur)
				})
			}
		})
	}

	// Event handlers for interactive elements
	const handleInteractiveElementFocus = (event: Event) => {
		const element = event.target as HTMLElement
		element.removeAttribute('aria-hidden')
	}

	const handleInteractiveElementBlur = (event: Event) => {
		const element = event.target as HTMLElement
		const cell = element.closest('th')
		if (!cell) return

		const interactiveElements = cell.querySelectorAll('button, [tabindex]:not([tabindex="-1"])')
		const isPrimary = element === interactiveElements[0]

		if (!isPrimary) {
			element.setAttribute('aria-hidden', 'true')
		}
	}

	// Update status message for screen readers
	const updateStatusMessage = () => {
		const count = items.value.length
		statusMessage.value = locales.rowCountStatus(count)
	}

	// Setup all ARIA attributes
	const setupAria = async () => {
		await updateTableAria()
		await updateRowAria()
		await updateHeaderAria()
		updateStatusMessage()
	}

	// Watch for changes that require ARIA updates
	watch(() => items.value.length, () => {
		updateStatusMessage()
		updateRowAria()
		updateTableAria()
	})

	watch(() => totalItemsCount.value, () => {
		updateTableAria()
	})

	watch(() => options.value.sortBy, () => {
		updateHeaderAria()
	}, { deep: true })

	watch(() => options.value.page, () => {
		updateRowAria()
	})

	// Setup ARIA attributes when component is mounted
	onMounted(() => {
		setupAria()
	})

	return {
		statusRegionId,
		statusMessage,
		totalRowCount,
		getSortState,
		setupAria,
		updateTableAria,
		updateRowAria,
		updateHeaderAria,
		updateStatusMessage,
	}
}
