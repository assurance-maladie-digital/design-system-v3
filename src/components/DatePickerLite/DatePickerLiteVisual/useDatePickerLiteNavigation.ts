import { computed, ref, watch, type Ref } from 'vue'
import type { PickerView } from '@/components/Common/Calendar/locales'

export interface UseDatePickerLiteNavigationParams {
	modelValue: Ref<Date | undefined>
	initialView: Ref<'days' | 'months' | 'years'>
}

export function useDatePickerLiteNavigation({
	modelValue,
	initialView,
}: UseDatePickerLiteNavigationParams) {
	/**
	 * `view` controls which panel is displayed: days, months, or years.
	 * This is a UI state, not the source of truth from the model.
	 */
	const view = ref<PickerView>(initialView.value)

	/**
	 * `visibleMonth` is the navigation cursor. It stays independent from the selected value
	 * so the user can browse around the calendar without mutating the model immediately.
	 */
	const visibleMonth = ref<Date | undefined>(undefined)

	/**
	 * `currentMonth` is the effective month shown by the calendar:
	 * we prefer the navigation cursor when it exists, otherwise we fall back to the selected value.
	 */
	const currentMonth = computed<Date>(() => visibleMonth.value ?? modelValue.value ?? new Date())
	const visibleMonthIndex = computed<number>(() => currentMonth.value.getMonth() + 1)
	const visibleYear = computed<number>(() => currentMonth.value.getFullYear())

	/**
	 * Keep the navigation cursor aligned with the selected date whenever the model changes.
	 * This makes the calendar jump to the right month when the value is set externally.
	 */
	watch(
		modelValue,
		(newValue) => {
			visibleMonth.value = newValue ? new Date(newValue) : new Date()
		},
		{ immediate: true },
	)

	/**
	 * When the picker is reopened, we reset the UI to the initial panel and return to the current selection.
	 * This avoids starting in a stale month after the user navigates away from the initial value.
	 */
	function resetViewOnOpen() {
		view.value = initialView.value
		visibleMonth.value = modelValue.value ? new Date(modelValue.value) : new Date()
	}

	function previousMonth() {
		const current = currentMonth.value
		visibleMonth.value = new Date(current.getFullYear(), current.getMonth() - 1, 1)
	}

	function nextMonth() {
		const current = currentMonth.value
		visibleMonth.value = new Date(current.getFullYear(), current.getMonth() + 1, 1)
	}

	function setYear(year: number) {
		const current = visibleMonth.value ?? new Date()
		visibleMonth.value = new Date(year, current.getMonth(), 1)
		view.value = 'months'
	}

	function setMonth(month: number) {
		const current = visibleMonth.value ?? new Date()
		visibleMonth.value = new Date(current.getFullYear(), month - 1, 1)
		view.value = 'days'
	}

	return {
		view,
		visibleMonth,
		currentMonth,
		visibleMonthIndex,
		visibleYear,
		resetViewOnOpen,
		previousMonth,
		nextMonth,
		setYear,
		setMonth,
	}
}
