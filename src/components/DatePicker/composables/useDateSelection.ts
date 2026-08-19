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
	const currentFormat = () => unref(format)

	const resetRange = () => {
		rangeBoundaryDates.value = null
	}

	const clearSelection = () => {
		selectedDates.value = null
		resetRange()
	}

	/**
	 * Génère toutes les dates entre deux dates (incluses)
	 */
	const generateDateRange = (start: Date, end: Date): Date[] => {
		const dateArray: Date[] = []
		const currentDate = new Date(start)

		// Ajouter la date de début
		dateArray.push(new Date(currentDate))

		// Ajouter toutes les dates intermédiaires jusqu'à la date de fin
		while (currentDate < end) {
			currentDate.setDate(currentDate.getDate() + 1)
			dateArray.push(new Date(currentDate))
		}

		return dateArray
	}

	const applySingleSelection = (date: Date | null) => {
		selectedDates.value = date
		resetRange()
	}

	const startRangeSelection = (date: Date) => {
		rangeBoundaryDates.value = [date, null]
		selectedDates.value = [date]
	}

	const applyRangeSelection = (startDate: Date, endDate: Date) => {
		rangeBoundaryDates.value = [startDate, endDate]

		selectedDates.value = startDate.getTime() <= endDate.getTime()
			? generateDateRange(startDate, endDate)
			: [startDate, endDate]
	}

	const getPendingRangeStart = (): Date | null => {
		if (rangeBoundaryDates.value?.[0] && !rangeBoundaryDates.value[1]) {
			return rangeBoundaryDates.value[0]
		}

		if (Array.isArray(selectedDates.value) && selectedDates.value.length === 1) {
			return selectedDates.value[0] ?? null
		}

		return null
	}

	const applyProgressiveRangeSelection = (date: Date) => {
		const pendingStart = getPendingRangeStart()

		if (!pendingStart) {
			startRangeSelection(date)
			return
		}

		applyRangeSelection(pendingStart, date)
	}

	const toDate = (value: Date | string | null | undefined): Date | null => {
		if (value instanceof Date) return value
		return value ? parseDate(value, currentFormat()) : null
	}

	const parseDateArray = (input: (Date | string | null | undefined)[]): Date[] => (
		input
			.map(toDate)
			.filter((date): date is Date => date !== null)
	)

	const parseRangeString = (value: string): [Date, Date] | null => {
		const [startDateText, endDateText] = value.split(locales.rangeSeparator)
		if (startDateText === undefined || endDateText === undefined) return null

		const startDate = parseDate(startDateText, currentFormat())
		const endDate = parseDate(endDateText, currentFormat())
		if (!startDate || !endDate) return null

		return [startDate, endDate]
	}

	/**
	 * Met à jour les dates sélectionnées en fonction de l'entrée
	 */
	const updateSelectedDates = (input: Date | Date[] | string | string[] | null | undefined) => {
		if (input === null || input === undefined) {
			clearSelection()
			return
		}

		if (Array.isArray(input)) {
			const dates = parseDateArray(input)

			if (dates.length === 0) {
				clearSelection()
				return
			}

			if (unref(displayRange)) {
				if (dates.length >= 2) {
					dates.sort((a, b) => a.getTime() - b.getTime())
					const startDate = dates[0]!
					const endDate = dates[dates.length - 1]!
					applyRangeSelection(startDate, endDate)
				}
				else {
					startRangeSelection(dates[0]!)
				}
			}
			else {
				selectedDates.value = dates
				resetRange()
			}
			return
		}

		if (unref(displayRange) && input instanceof Date) {
			applyProgressiveRangeSelection(input)
			return
		}

		if (!unref(displayRange) && input instanceof Date) {
			applySingleSelection(input)
			return
		}

		if (!unref(displayRange)) {
			applySingleSelection(typeof input === 'string' ? parseDate(input, currentFormat()) : null)
			return
		}

		if (typeof input !== 'string') return

		const parsedRange = parseRangeString(input)
		if (!parsedRange) return

		const [startDate, endDate] = parsedRange
		if (startDate && endDate) {
			applyRangeSelection(startDate, endDate)
		}
	}

	return {
		updateSelectedDates,
		rangeBoundaryDates,
		generateDateRange,
		resetRange,
	}
}
