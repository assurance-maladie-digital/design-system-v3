import { computed, type ComputedRef } from 'vue'
import dayjs from 'dayjs'
import { formatDateLabel, formatDateRangeEnd, formatDateShort, locales } from '../locales'
import { type DateObjectValue } from '../types'

export interface DisplayedDateStringProps {
	selectedDates: { value: DateObjectValue }
	rangeBoundaryDates?: { value: [Date | null, Date | null] | null }
	todayInString: ComputedRef<string>
}

export interface DisplayedDateStringReturn {
	displayedDateString: ComputedRef<string>
}

/**
 * Composable pour formater l'affichage des dates sélectionnées
 * Gère à la fois les dates uniques et les plages de dates
 */
export function useDisplayedDateString(props: DisplayedDateStringProps): DisplayedDateStringReturn {
	const isUsableDateValue = (value: Date | string | null | undefined): boolean => {
		if (value === null || value === undefined) return false
		if (value instanceof Date) return !Number.isNaN(value.getTime())
		return true
	}

	const formatRangeLabel = (start: Date | null | undefined, end: Date | null | undefined): string | null => {
		if (!isUsableDateValue(start) || !isUsableDateValue(end)) return null

		const startDate = dayjs(start)
		const endDate = dayjs(end)

		if (!startDate.isValid() || !endDate.isValid()) return null

		return `${formatDateShort(startDate)}${locales.rangeSeparator}${formatDateRangeEnd(endDate)}`
	}

	const formatSingleLabel = (value: Date | null | undefined): string | null => {
		if (!isUsableDateValue(value)) return null

		const date = dayjs(value)
		return date.isValid() ? formatDateLabel(date) : null
	}

	const displayedDateString = computed(() => {
		if (!props.selectedDates.value) return props.todayInString.value

		const boundaryRangeLabel = formatRangeLabel(
			props.rangeBoundaryDates?.value?.[0],
			props.rangeBoundaryDates?.value?.[1],
		)
		if (boundaryRangeLabel) return boundaryRangeLabel

		if (Array.isArray(props.selectedDates.value)) {
			const [startDate] = props.selectedDates.value
			const endDate = props.selectedDates.value[props.selectedDates.value.length - 1]

			if (props.selectedDates.value.length >= 2) {
				return formatRangeLabel(startDate, endDate) ?? props.todayInString.value
			}

			return formatSingleLabel(startDate) ?? props.todayInString.value
		}

		return formatSingleLabel(props.selectedDates.value) ?? props.todayInString.value
	})

	return {
		displayedDateString,
	}
}
