import { ref, unref } from 'vue'
import type { Ref, MaybeRef } from 'vue'
import { locales } from '../locales'

/**
 * Composable pour gérer la sélection de dates dans les composants CalendarMode
 * Gère les plages de dates et la génération des dates intermédiaires
 */
export function useDateSelection(
	parseDate: (dateStr: string, format: string) => Date | null,
	selectedDates: Ref<Date | (Date | null)[] | null>,
	format: MaybeRef<string>,
	displayRange: MaybeRef<boolean>,
) {
	const rangeBoundaryDates = ref<[Date | null, Date | null] | null>(null)

	const clearSelection = () => {
		selectedDates.value = null
		rangeBoundaryDates.value = null
	}

	const resetRange = () => {
		rangeBoundaryDates.value = null
	}

	const generateDateRange = (start: Date, end: Date): Date[] => {
		const dateArray: Date[] = []
		const currentDate = new Date(start)

		dateArray.push(new Date(currentDate))

		while (currentDate < end) {
			currentDate.setDate(currentDate.getDate() + 1)
			dateArray.push(new Date(currentDate))
		}

		return dateArray
	}

	const setRangeSelection = (startDate: Date, endDate: Date) => {
		const [rangeStart, rangeEnd] = startDate.getTime() <= endDate.getTime()
			? [startDate, endDate]
			: [endDate, startDate]

		rangeBoundaryDates.value = [rangeStart, rangeEnd]
		selectedDates.value = generateDateRange(rangeStart, rangeEnd)
	}

	const updateSelectedDates = (input: Date | Date[] | string | null | undefined) => {
		if (input === null || input === undefined) {
			clearSelection()
			return
		}

		if (Array.isArray(input)) {
			const dates = input.filter((date): date is Date => date instanceof Date)
			if (dates.length === 0) {
				clearSelection()
				return
			}

			if (unref(displayRange) && dates.length >= 2) {
				setRangeSelection(dates[0]!, dates[dates.length - 1]!)
			}
			else {
				selectedDates.value = dates
				rangeBoundaryDates.value = null
			}
			return
		}

		if (!unref(displayRange) && input instanceof Date) {
			selectedDates.value = input
			rangeBoundaryDates.value = null
			return
		}

		if (!unref(displayRange)) {
			const date = input && typeof input === 'string' ? parseDate(input, unref(format)) : null
			selectedDates.value = date === null ? null : date
			rangeBoundaryDates.value = null
		}
		else if (typeof input === 'string') {
			const dates = input.split(locales.rangeSeparator)
			if (dates.length === 2) {
				const startDate = parseDate(dates[0]!, unref(format))
				const endDate = parseDate(dates[1]!, unref(format))
				if (startDate && endDate) {
					setRangeSelection(startDate, endDate)
				}
			}
		}
	}

	return {
		updateSelectedDates,
		rangeBoundaryDates,
		generateDateRange,
		resetRange,
	}
}
