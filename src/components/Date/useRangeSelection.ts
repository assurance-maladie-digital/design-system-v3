import { computed, ref, toValue, type MaybeRefOrGetter } from 'vue'
import { getISODatePart } from './utils'

/**
 * Managing the state of a date range selection: pending boundaries,
 * preview and resulting intervals
 */
export default function useRangeSelection(
	enabled: MaybeRefOrGetter<boolean | undefined>,
	selectedRange: MaybeRefOrGetter<[Date, Date] | undefined>,
	onSelect: (range: [Date, Date]) => void,
) {
	/** First boundary picked by the user, while the selection is in progress */
	const startRange = ref<Date | null>(null)

	/** Boundary previewed under the pointer or the keyboard focus */
	const hoveredDay = ref<Date | null>(null)

	/** True while a range selection is in progress */
	const isSelecting = computed(() => Boolean(toValue(enabled) && startRange.value))

	/** Committed range as ordered day-granularity ISO bounds */
	const committedInterval = computed<[string, string] | null>(() => {
		if (!toValue(enabled)) return null
		const range = toValue(selectedRange)
		if (!range?.[0] || !range[1]) return null
		const start = getISODatePart(range[0])
		const end = getISODatePart(range[1])
		return start <= end ? [start, end] : [end, start]
	})

	/** Pending range as ordered ISO dates, reduced to its start until a day is previewed */
	const previewedInterval = computed<[string, string] | null>(() => {
		if (!startRange.value) return null
		const start = getISODatePart(startRange.value)
		const end = hoveredDay.value ? getISODatePart(hoveredDay.value) : start
		return start <= end ? [start, end] : [end, start]
	})

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

	return {
		isSelecting,
		committedInterval,
		previewedInterval,
		previewRange,
		selectDay,
		cancelSelection,
	}
}
