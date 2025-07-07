export default function filter(itemValue: unknown, filterValue: unknown): boolean {
	const str = String(itemValue ?? '')
	const search = String(filterValue ?? '')

	if (search.startsWith('"') && search.endsWith('"')) {
		const regex = generateRegex(search.slice(1, -1), true)
		return regex.test(str)
	}

	else if (search.startsWith('=')) {
		const regex = generateRegex(search.slice(1), true, true)
		return regex.test(str)
	}

	else if (search.startsWith('<>')) {
		const regex = generateRegex(search.slice(2), true, true)
		return !regex.test(str)
	}

	else if (search.startsWith('<=')) {
		const cleanedSearch = search.slice(2).trim()
		return str.localeCompare(cleanedSearch) <= 0
	}

	else if (search.startsWith('>=')) {
		const cleanedSearch = search.slice(2).trim()
		return str.localeCompare(cleanedSearch) >= 0
	}

	else if (search.startsWith('>')) {
		const cleanedSearch = search.slice(1).trim()
		return str.localeCompare(cleanedSearch) > 0
	}

	else if (search.startsWith('<')) {
		const cleanedSearch = search.slice(1).trim()
		return str.localeCompare(cleanedSearch) < 0
	}

	else {
		const regex = generateRegex(removeAccents(search))
		return regex.test(removeAccents(str))
	}
}

function generateRegex(search: string, caseSensitive = false, strict = false): RegExp {
	const escapedSearch = search.replace(/[-[\]{}()+.,\\^$|#\s]/g, '\\$&')
	const regexSequenceWithWildcards = escapedSearch.replace(/\?/g, '.')
	let regex = regexSequenceWithWildcards.replace(/\*/g, '.*')
	if (strict) {
		regex = '^' + regex + '$'
	}
	else if (regex !== escapedSearch) {
		regex = '^' + regex
	}

	return new RegExp(regex, caseSensitive ? 'g' : 'gi')
}

function removeAccents(str: string): string {
	return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}
