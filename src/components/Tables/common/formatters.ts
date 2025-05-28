/**
 * Utility functions for formatting data in tables
 */

/**
 * Format a period object for display
 *
 * @param value - The period value to format
 * @returns Formatted period string
 */
export function formatPeriod(value: unknown): string {
	// Handle null or undefined
	if (value === null || value === undefined) {
		return ''
	}

	// Handle period objects
	if (typeof value === 'object' && value !== null && 'from' in value && 'to' in value) {
		const periodValue = value as { from?: string | null, to?: string | null }
		const from = periodValue.from || ''
		const to = periodValue.to || ''

		// Format as "du [date] au [date]"
		if (from && to) {
			return `du ${from} au ${to}`
		}
		// If only from date is present
		else if (from) {
			return `du ${from}`
		}
		// If only to date is present
		else if (to) {
			return `au ${to}`
		}
	}

	// Fallback to string representation
	return String(value)
}

/**
 * Process table items to format special fields like periods
 *
 * @param items - The table items to process
 * @returns Processed items with formatted values
 */
export function processItems(items: Record<string, unknown>[]): Record<string, unknown>[] {
	if (!items || !Array.isArray(items)) return []

	return items.map((item) => {
		if (!item) return item

		const newItem = { ...item } as Record<string, unknown>

		// Format vacation period if it exists and is a period object
		if (newItem.vacationPeriod
			&& typeof newItem.vacationPeriod === 'object'
			&& newItem.vacationPeriod !== null
			&& 'from' in newItem.vacationPeriod
			&& 'to' in newItem.vacationPeriod) {
			newItem.vacationPeriod = formatPeriod(newItem.vacationPeriod)
		}

		return newItem
	})
}
