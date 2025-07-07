import { parseDate } from '../../tableFilterUtils'

export default function filter(itemValue: unknown, filterValue: unknown): boolean {
	const itemDate = parseDate(itemValue)
	const targetDate = parseDate(filterValue)
	if (!itemDate || !targetDate) return false
	return (
		itemDate.getDate() === targetDate.getDate()
		&& itemDate.getMonth() === targetDate.getMonth()
		&& itemDate.getFullYear() === targetDate.getFullYear()
	)
}
