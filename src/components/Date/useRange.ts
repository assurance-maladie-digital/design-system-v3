import { computed, ref, toValue, type MaybeRefOrGetter } from 'vue'
import { getISODatePart } from './utils'

export default function useRange(
	enabled: MaybeRefOrGetter<boolean | undefined>,
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

	/** Preview a boundary for the pending range, null clearing the preview */
	function previewRange(day: Date | null) {
		hoveredDay.value = day
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
		startRange.value = null
		hoveredDay.value = null
	}

	return { isSelecting, isPreviewed, previewRange, selectDay }
}
