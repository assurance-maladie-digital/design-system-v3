import { computed, ref, toValue, type MaybeRefOrGetter } from 'vue'
import { getISODatePart, type ISODate } from './utils'

/**
 * Managing the state of an in-progress date range selection: pending
 * boundaries and preview range
 */
export default function useRangeSelection(
	enabled: MaybeRefOrGetter<boolean | undefined>,
	onSelect: (range: [Date, Date]) => void,
) {
	/** First boundary picked by the user, while the selection is in progress */
	const anchor = ref<Date | null>(null)

	/** Day previewed as the second boundary, under the pointer or the keyboard focus */
	const previewedDay = ref<Date | null>(null)

	/** True while a range selection is in progress */
	const isSelecting = computed(() => Boolean(toValue(enabled) && anchor.value))

	/** Pending range as ordered ISO dates, reduced to its start until a day is previewed */
	const previewedRange = computed<[ISODate, ISODate] | null>(() => {
		if (!anchor.value) return null
		const start = getISODatePart(anchor.value)
		const end = previewedDay.value ? getISODatePart(previewedDay.value) : start
		return start <= end ? [start, end] : [end, start]
	})

	/** Preview a boundary for the pending range, null clearing the preview */
	function previewRange(day: Date | null) {
		previewedDay.value = day
	}

	/** Cancel the pending range selection, no-op if none is in progress */
	function cancelSelection() {
		anchor.value = null
		previewedDay.value = null
	}

	/** First call sets the range anchor, second call emits the ordered range */
	function selectDay(date: Date) {
		if (!toValue(enabled)) return
		const start = anchor.value
		if (!start) {
			anchor.value = date
			return
		}
		onSelect(date < start ? [date, start] : [start, date])
		cancelSelection()
	}

	return {
		isSelecting,
		previewedRange,
		previewRange,
		selectDay,
		cancelSelection,
	}
}
