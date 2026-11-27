import { ref, type Ref } from 'vue'

export function useMonthGrid(
	monthSelector: Ref<HTMLElement | null>,
	initialMonth: number = 0,
) {
	const monthsPerRow = 2
	/**
	 * Actual focused month, used for keyboard navigation. 1-based index (1 = January, 12 = December)
	 */
	const activeMonth = ref(initialMonth)

	function selectNextMonth() {
		selectMonth((activeMonth.value % 12) + 1)
	}
	function selectPreviousMonth() {
		selectMonth((activeMonth.value - 2 + 12) % 12 + 1)
	}
	function selectNextRow() {
		selectMonth(((activeMonth.value - 1 + monthsPerRow) % 12) + 1)
	}
	function selectPreviousRow() {
		selectMonth(((activeMonth.value - 1 - monthsPerRow + 12) % 12) + 1)
	}

	function selectMonth(month: number) {
		activeMonth.value = month
		focusActiveMonth()
	}

	function focusActiveMonth() {
		monthSelector.value!
			.querySelector<HTMLElement>(`.month-${activeMonth.value}`)!
			.focus()
	}

	return {
		activeMonth,
		selectMonth,
		selectNextMonth,
		selectPreviousMonth,
		selectNextRow,
		selectPreviousRow,
	}
}
