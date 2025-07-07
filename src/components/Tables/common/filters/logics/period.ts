import { parseDate } from '../../tableFilterUtils'

export default function filter(itemValue: unknown, filterValue: unknown): boolean {
	const itemDate = parseDate(itemValue)
	if (
		typeof filterValue !== 'object'
		|| filterValue === null
		|| 'from' in filterValue === false
		|| 'to' in filterValue === false
	) throw new Error('Invalid filter value for period type')

	const min = parseDate(filterValue.from)
	const max = parseDate(filterValue.to)

	if (itemDate) {
		if (min && itemDate < min) {
			return false
		}
		if (max && itemDate > max) {
			return false
		}
	}

	return true
}
