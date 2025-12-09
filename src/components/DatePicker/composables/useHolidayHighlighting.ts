import { nextTick, type Ref } from 'vue'
import { useHolidayDay } from '@/composables/date/useHolidayDay'

export interface UseHolidayHighlightingOptions {
	currentMonth: Ref<string | null>
	currentYear: Ref<string | null>
	isDisplayHolidayDays: () => boolean
	rootElement?: Ref<HTMLElement | null>
}

export interface UseHolidayHighlightingResult {
	markHolidayDays: () => void
}

/**
 * Composable partagé pour le marquage des jours fériés dans les VDatePicker
 * utilisé par CalendarMode et ComplexDatePicker.
 */
export const useHolidayHighlighting = (
	options: UseHolidayHighlightingOptions,
): UseHolidayHighlightingResult => {
	const { currentMonth, currentYear, isDisplayHolidayDays, rootElement } = options
	const { getJoursFeries } = useHolidayDay()

	const markHolidayDays = () => {
		if (!isDisplayHolidayDays()) return

		nextTick(() => {
			const rootNode = rootElement?.value ?? document
			const previouslyMarkedDays = rootNode.querySelectorAll('.holiday-day')
			previouslyMarkedDays.forEach((element) => {
				(element as HTMLElement).classList.remove('holiday-day')
			})

			const now = new Date()
			const year = parseInt(currentYear.value || now.getFullYear().toString(), 10)
			const month = parseInt(
				currentMonth.value !== null ? currentMonth.value : now.getMonth().toString(),
				10,
			)

			const joursFeries = getJoursFeries(year)
			const holidayDates = Array.from(joursFeries).map((dateStr) => {
				const [day, monthStr, yearStr] = dateStr.split('/')
				return new Date(parseInt(yearStr, 10), parseInt(monthStr, 10) - 1, parseInt(day, 10))
			})

			const monthHolidays = holidayDates.filter(holiday => holiday.getFullYear() === year && holiday.getMonth() === month)

			monthHolidays.forEach((holiday) => {
				const day = holiday.getDate()
				const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
				const dayElements = rootNode.querySelectorAll(`[data-v-date="${dateStr}"]`)
				dayElements.forEach((element) => {
					(element as HTMLElement).classList.add('holiday-day')
				})
			})
		})
	}

	return {
		markHolidayDays,
	}
}
