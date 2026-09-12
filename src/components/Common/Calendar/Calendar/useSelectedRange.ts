import { computed, toValue, type ComputedRef, type MaybeRefOrGetter } from 'vue'
import { getISODatePart, type ISODate } from './utils'
import { locales as defaultLocales } from './locales'
import type { FeaturedDaysInWeek } from './useCalendar'

/**
 * Derivations of the committed selected range: highlight range,
 * screen-reader announcement and per-day ARIA labels
 */
export default function useSelectedRange(
	selectRange: MaybeRefOrGetter<boolean | undefined>,
	selectedRange: MaybeRefOrGetter<[Date, Date] | undefined>,
	locales: ComputedRef<typeof defaultLocales>,
	locale: MaybeRefOrGetter<string>,
) {
	/** Committed range as ordered day-granularity ISO bounds */
	const committedRange = computed<[ISODate, ISODate] | null>(() => {
		if (!toValue(selectRange)) return null
		const range = toValue(selectedRange)
		if (!range?.[0] || !range[1]) return null
		const start = getISODatePart(range[0])
		const end = getISODatePart(range[1])
		return start <= end ? [start, end] : [end, start]
	})

	/** Screen reader announcement of the selected range */
	const rangeAnnouncement = computed(() => {
		const range = toValue(selectedRange)
		if (!range) return ''
		const [start, end] = range
		return locales.value.rangeSelected(
			start.toLocaleDateString(toValue(locale)),
			end.toLocaleDateString(toValue(locale)),
		)
	})

	/** Screen reader label describing the day's position in the selected range */
	function getAriaLabelForRange(day: FeaturedDaysInWeek) {
		const dayWithName = {
			...day,
			dayName: day.rawDate.toLocaleDateString(toValue(locale), { weekday: 'long' }),
		}
		if (day.isRangeStart) return locales.value.rangeStartLabel(dayWithName)
		if (day.isRangeEnd) return locales.value.rangeEndLabel(dayWithName)
		if (day.isInRange) return locales.value.rangeIncludedLabel(dayWithName)
		return undefined
	}

	return {
		committedRange,
		rangeAnnouncement,
		getAriaLabelForRange,
	}
}
