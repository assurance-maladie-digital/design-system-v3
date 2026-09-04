import { computed, nextTick, ref, type MaybeRefOrGetter } from 'vue'
import type { Ref } from 'vue'
import { getISODatePart, parseISODatePart } from './utils'
import useRangeSelection from './useRangeSelection'

export default function useInteractions(
	displayedMonth: Ref<Date | undefined>,
	rootElement: Ref<HTMLElement | undefined>,
	selectRange: MaybeRefOrGetter<boolean | undefined>,
	selectedRange: MaybeRefOrGetter<[Date, Date] | undefined>,
	emits: {
		(event: 'click:day', value: Date): void
		(event: 'update:selectedRange', value: [Date, Date]): void
	},
) {
	/** The month displayed by the calendar, falling back to the current month */
	const displayedView = computed(() => displayedMonth.value ?? new Date())

	/** Is the date outside the month primarily displayed by the calendar */
	function isOutsideDisplayedMonth(date: Date): boolean {
		return date.getFullYear() !== displayedView.value.getFullYear()
			|| date.getMonth() !== displayedView.value.getMonth()
	}

	/** First day of the displayed month, as an ISO date */
	const firstDayOfDisplayedMonth = computed(() => getISODatePart(new Date(
		displayedView.value.getFullYear(),
		displayedView.value.getMonth(),
		1,
	)))

	/** Day focused by the user via keyboard navigation or click */
	const userFocusedDay = ref<string>()

	/**
	 * The focused day: the day focused by the user if it belongs to the
	 * displayed month, otherwise the first day of the displayed month.
	 */
	const focusedDay = computed({
		get: () => {
			const userDay = userFocusedDay.value
			return userDay && !isOutsideDisplayedMonth(parseISODatePart(userDay))
				? userDay
				: firstDayOfDisplayedMonth.value
		},
		set: (value: string) => {
			userFocusedDay.value = value
		},
	})

	/** Focus a day, displaying its month if it is outside the displayed one */
	function focusDay(date: Date) {
		focusedDay.value = getISODatePart(date)
		if (isOutsideDisplayedMonth(date)) {
			displayedMonth.value = date
		}
	}

	function moveFocusedDayBy(days: number) {
		const currentFocusedDate = parseISODatePart(focusedDay.value)
		currentFocusedDate.setDate(currentFocusedDate.getDate() + days)
		focusDay(currentFocusedDate)
		moveFocusToFocusedDay()
	}

	function firstDay() {
		const date = parseISODatePart(firstDayOfDisplayedMonth.value)
		focusDay(date)
		moveFocusToFocusedDay()
	}

	function lastDay() {
		const date = parseISODatePart(firstDayOfDisplayedMonth.value)
		date.setMonth(date.getMonth() + 1)
		date.setDate(0)
		focusDay(date)
		moveFocusToFocusedDay()
	}

	/**
	 * Move the DOM focus to the focused day, once the grid has been re-rendered.
	 * During a month slide, both grids are in the DOM and the overflow days of
	 * the leaving grid duplicate the boundary day: exclude it, as its inert
	 * attribute makes focus() a silent no-op.
	 */
	async function moveFocusToFocusedDay() {
		await nextTick()
		const focusedElement = rootElement.value?.querySelector<HTMLElement>(`table:not([inert]) .day-${focusedDay.value}`)
		if (!focusedElement) {
			throw new Error(`Unable to focus the day: ${focusedDay.value}`)
		}
		focusedElement.focus()
	}

	const {
		isSelecting,
		committedInterval,
		previewedInterval,
		previewRange,
		selectDay,
		cancelSelection,
	} = useRangeSelection(
		selectRange,
		selectedRange,
		range => emits('update:selectedRange', range),
	)

	/** Arrows move the focus: the pending range preview follows it (focusin binding) */
	const keyboardActions: Record<string, (event: KeyboardEvent) => void> = {
		'ArrowRight': () => moveFocusedDayBy(1),
		'ArrowLeft': () => moveFocusedDayBy(-1),
		'ArrowDown': () => moveFocusedDayBy(7),
		'ArrowUp': () => moveFocusedDayBy(-7),
		'Home': firstDay,
		'End': lastDay,
		' ': () => click(parseISODatePart(focusedDay.value)),
		'Enter': () => click(parseISODatePart(focusedDay.value)),
		// Stops the propagation only when a selection is actually cancelled, so
		// an embedding picker still receives Escape when there is nothing to cancel
		'Escape': (event) => {
			if (!isSelecting.value) return
			event.stopPropagation()
			cancelSelection()
		},
	}

	const keyboardInteractions = {
		onKeydown(event: KeyboardEvent) {
			const action = keyboardActions[event.key]
			if (!action) return
			event.preventDefault()
			action(event)
		},
	}

	function click(date: Date) {
		focusDay(date)
		emits('click:day', date)
		selectDay(date)
	}

	return {
		focusedDay,
		focusDay,
		firstDayOfDisplayedMonth,
		keyboardInteractions,
		click,
		committedInterval,
		previewedInterval,
		previewRange,
	}
}
