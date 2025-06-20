export default function filter(itemValue: unknown, filterValue: unknown): boolean {
	// Handle multiple selection (filterValue is array)
	if (Array.isArray(filterValue)) {
		// If itemValue is also an array (e.g., item.skills = ['JavaScript', 'Vue'])
		if (Array.isArray(itemValue)) {
			// Check if any value in filterValue matches any value in itemValue
			return filterValue.some(fv =>
				itemValue.some(iv =>
					// Handle both primitive values and objects
					typeof fv === 'object' && fv !== null && typeof iv === 'object' && iv !== null
						? JSON.stringify(fv) === JSON.stringify(iv)
						: fv === iv,
				),
			)
		}
		else {
			// If itemValue is a single value, check if it's included in filterValue
			return filterValue.includes(itemValue as unknown as typeof filterValue[0])
		}
	}
	// Handle object comparison
	if (typeof filterValue === 'object' && filterValue !== null) {
		return JSON.stringify(filterValue) === JSON.stringify(itemValue)
	}
	// Handle single value comparison
	return itemValue === filterValue
}
