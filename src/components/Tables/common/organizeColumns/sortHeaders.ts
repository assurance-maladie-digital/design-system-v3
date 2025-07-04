import type { DataTableHeaders } from '../types'

export function sortHeaders(
	headers: DataTableHeaders[],
): DataTableHeaders[] {
	return [...headers].sort((a, b) => {
		return (a.order || 0) - (b.order || 0)
	})
}
