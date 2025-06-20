export default function filter(itemValue: unknown, filterValue: unknown): boolean {
	if (typeof itemValue === 'number') {
		// Handle string filter values that may contain operators
		if (typeof filterValue === 'string') {
			// Check for operators at the beginning of the string
			const operatorMatch = /^([=<>]{1,2})(.+)$/.exec(filterValue)
			if (operatorMatch) {
				const operator = operatorMatch[1]
				const valueStr = operatorMatch[2].trim()
				const numValue = parseFloat(valueStr.replace(',', '.'))

				if (isNaN(numValue)) return false

				switch (operator) {
					case '=':
						return itemValue === numValue
					case '<>':
						return itemValue !== numValue
					case '<':
						return itemValue < numValue
					case '<=':
						return itemValue <= numValue
					case '>':
						return itemValue > numValue
					case '>=':
						return itemValue >= numValue
					default:
						return false
				}
			}

			// No operator, try to parse the value and do exact match
			const numValue = parseFloat(filterValue.replace(',', '.'))
			if (!isNaN(numValue)) {
				return itemValue === numValue
			}
			return false
		}

		// Handle numeric filter values (exact match)
		if (typeof filterValue === 'number') {
			return itemValue === filterValue
		}

		return String(itemValue).includes(String(filterValue))
	}
	return false
}
