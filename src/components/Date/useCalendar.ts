import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { getISODatePart } from './utils'

/** Minimal number of rows always displayed */
const totalRows = 6

export type FeaturedDaysInWeek = {
	rawDate: Date
	isPreviousMonth: boolean
	isNextMonth: boolean
	isCurrentMonth: boolean
	day: number
	ISO8601: string
	isSelected: boolean
	isStartRange: boolean
	isEndRange: boolean
	isInRange: boolean
	isToday: boolean
	isWeekend: boolean
}

/**
 * Get the days to display in a calendar grid
 */
export default function useCalendar(
	month: MaybeRefOrGetter<Date | undefined>,
	selectedDays: MaybeRefOrGetter<Date[] | undefined>,
	selectedRange: MaybeRefOrGetter<[Date | undefined, Date | undefined] | undefined>,
) {
	/** Date of reference for the view */
	const dateView = computed<Date>(() => toValue(month) ?? new Date())

	/**
	 * Is the day selected, do not account for the ranges
	 */
	function isDaySelected(day: Date): boolean {
		const plainSelectedDays = toValue(selectedDays)
		if (!plainSelectedDays) return false
		return plainSelectedDays.some(selectedDay => selectedDay.toDateString() === day.toDateString())
	}

	/** The month number 0 - 11 */
	const displayedMonth = computed(() => dateView.value.getMonth())
	const displayedYear = computed(() => dateView.value.getFullYear())

	/** The month and year in full letters */
	const localizedFullMonth = computed(() => Intl.DateTimeFormat(
		typeof navigator === 'undefined' ? 'fr-FR' : navigator.language,
		{ month: 'long', year: 'numeric' },
	).format(dateView.value))

	const nbOfDaysInMonth = computed<number>(() => {
		const date = new Date(displayedYear.value, displayedMonth.value + 1, 0)
		return date.getDate()
	})

	const firstDayOfTheMonth = computed<number>(() => {
		const date = new Date(displayedYear.value, displayedMonth.value, 1)
		return date.getDay()
	})

	const dayOfTheMonth = computed<Date[]>(() => {
		const dates: Date[] = []
		for (let i = 1; i <= nbOfDaysInMonth.value; i++) {
			dates.push(new Date(displayedYear.value, displayedMonth.value, i))
		}
		return dates
	})

	/**
	 * The days to display in order to fill the first week of the calendar before the first day of the displayed month
	 */
	const daysBeforeStartOfMonth = computed<Date[]>(() => {
		const dates: Date[] = []
		const daysSinceMonday = (firstDayOfTheMonth.value + 6) % 7
		for (let i = daysSinceMonday; i > 0; i--) {
			dates.push(new Date(displayedYear.value, displayedMonth.value, -i + 1))
		}
		return dates
	})

	/**
	 * The day to display in order to fill the end of the calendar,
	 * the total number of rows to fill is defined by the constant 'totalRows'
	 */
	const daysAfterEndOfMonth = computed<Date[]>(() => {
		const dates: Date[] = []
		const lastDayOfMonth = dayOfTheMonth.value.at(-1)
		const alreadyDisplayedDays = dayOfTheMonth.value.length + daysBeforeStartOfMonth.value.length
		const remainingDays = totalRows * 7 - alreadyDisplayedDays
		for (let i = 1; i <= remainingDays; i++) {
			dates.push(new Date(displayedYear.value, displayedMonth.value, lastDayOfMonth!.getDate() + i))
		}
		return dates
	})

	/**
	 * The displayed days with some flags and data used for th display
	 */
	const displayedDays = computed<FeaturedDaysInWeek[]>(() => {
		const firstDay = dayOfTheMonth.value[0]!
		const lastDay = dayOfTheMonth.value.at(-1)!
		const range = toValue(selectedRange)
		// Day-granularity ISO bounds: range dates may carry a time component
		const startIso = range?.[0] ? getISODatePart(range[0]) : undefined
		const endIso = range?.[1] ? getISODatePart(range[1]) : undefined
		const days = [...daysBeforeStartOfMonth.value, ...dayOfTheMonth.value, ...daysAfterEndOfMonth.value]

		return days.map((rawDate) => {
			const isoDate = getISODatePart(rawDate)
			return {
				rawDate,
				isPreviousMonth: rawDate < firstDay,
				isNextMonth: rawDate > lastDay,
				isCurrentMonth: rawDate >= firstDay && rawDate <= lastDay,
				day: rawDate.getDate(),
				ISO8601: isoDate,
				isToday: rawDate.toDateString() === new Date().toDateString(),
				isWeekend: rawDate.getDay() === 0 || rawDate.getDay() === 6,
				isSelected: isDaySelected(rawDate),
				isStartRange: startIso === isoDate,
				isInRange: startIso !== undefined && endIso !== undefined && isoDate > startIso && isoDate < endIso,
				isEndRange: endIso === isoDate,
			}
		})
	})

	type DisplayedFeaturedDaysInWeek = [FeaturedDaysInWeek, FeaturedDaysInWeek, FeaturedDaysInWeek, FeaturedDaysInWeek, FeaturedDaysInWeek, FeaturedDaysInWeek, FeaturedDaysInWeek]
	type DisplayedFeaturedWeeks = DisplayedFeaturedDaysInWeek[]

	/**
	 * The displayed weeks with their corresponding featured days.
	 */
	const displayedWeeks = computed<DisplayedFeaturedWeeks>(() => {
		return Array.from({ length: totalRows }, (_, weekIndex) =>
			displayedDays.value.slice(weekIndex * 7, weekIndex * 7 + 7) as DisplayedFeaturedDaysInWeek,
		)
	})

	return {
		displayedWeeks,
		localizedFullMonth,
		month: dateView,
	}
}
