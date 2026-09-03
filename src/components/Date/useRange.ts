import { computed, ref, toValue, type MaybeRefOrGetter } from 'vue'
import { getISODatePart, localizedDays } from './utils'
import type { FeaturedDaysInWeek } from './useCalendar'
import type { locales as defaultLocales } from './locales'

/**
 * Managing the selection and preview of a date range
 */
export default function useRange(
	enabled: MaybeRefOrGetter<boolean | undefined>,
	selectedRange: MaybeRefOrGetter<[Date, Date] | undefined>,
	locales: MaybeRefOrGetter<typeof defaultLocales>,
	onSelect: (range: [Date, Date]) => void,
) {
	/** First boundary picked by the user, while the selection is in progress */
	const startRange = ref<Date | null>(null)

	/** Boundary previewed under the pointer or the keyboard focus */
	const hoveredDay = ref<Date | null>(null)

	/** True while a range selection is in progress */
	const isSelecting = computed(() => Boolean(toValue(enabled) && startRange.value))

	/** Pending range as ordered ISO dates, reduced to its start until a day is previewed */
	const previewedInterval = computed<[string, string] | null>(() => {
		if (!startRange.value) return null
		const start = getISODatePart(startRange.value)
		const end = hoveredDay.value ? getISODatePart(hoveredDay.value) : start
		return start <= end ? [start, end] : [end, start]
	})

	/** Does the day belong to the pending range being previewed */
	function isPreviewed(isoDate: string): boolean {
		const interval = previewedInterval.value
		return interval !== null && isoDate >= interval[0] && isoDate <= interval[1]
	}

	/** Is the day the first day of the pending range being previewed */
	function isPreviewStart(isoDate: string): boolean {
		const interval = previewedInterval.value
		return interval !== null && isoDate === interval[0]
	}

	/** Is the day the last day of the pending range being previewed */
	function isPreviewEnd(isoDate: string): boolean {
		const interval = previewedInterval.value
		return interval !== null && isoDate === interval[1]
	}

	/** Is the day a boundary of the selected range, when range selection is enabled */
	function isRangeEdge(day: FeaturedDaysInWeek): boolean {
		return Boolean(toValue(enabled) && (day.isStartRange || day.isEndRange))
	}

	/** Preview a boundary for the pending range, null clearing the preview */
	function previewRange(day: Date | null) {
		hoveredDay.value = day
	}

	/** Cancel the pending range selection, no-op if none is in progress */
	function cancelSelection() {
		startRange.value = null
		hoveredDay.value = null
	}

	/** First call sets the range start, second call emits the ordered range */
	function selectDay(date: Date) {
		if (!toValue(enabled)) return
		const start = startRange.value
		if (!start) {
			startRange.value = date
			return
		}
		onSelect(date < start ? [date, start] : [start, date])
		cancelSelection()
	}

	/** Screen reader announcement of the selected range */
	const rangeAnnouncement = computed(() => {
		const range = toValue(selectedRange)
		if (!range) return ''
		const [start, end] = range
		return toValue(locales).rangeSelected(
			start.toLocaleDateString('fr-FR'),
			end.toLocaleDateString('fr-FR'),
		)
	})

	/** Screen reader label describing the day's position in the selected range */
	function getAriaLabelForRange(day: FeaturedDaysInWeek) {
		if (!toValue(enabled)) return undefined
		const dayInfo = localizedDays[day.rawDate.getDay()]!
		const dayWithName = {
			...day,
			dayName: dayInfo.long,
		}
		if (day.isStartRange) return toValue(locales).rangeStartLabel(dayWithName)
		if (day.isEndRange) return toValue(locales).rangeEndLabel(dayWithName)
		if (day.isInRange) return toValue(locales).rangeIncludedLabel(dayWithName)
		return undefined
	}

	return { isSelecting, isPreviewed, isPreviewStart, isPreviewEnd, isRangeEdge, previewRange, selectDay, cancelSelection, rangeAnnouncement, getAriaLabelForRange }
}
