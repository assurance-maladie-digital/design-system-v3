import { computed, type ComputedRef } from 'vue'
import dayjs from 'dayjs'
import { formatDateLabel } from '../locales'
import { type DateObjectValue } from '../types'
import { locales } from '../locales'
import type { DateModelValue } from '@/composables/date/useDateInitializationDayjs'

export interface TodayButtonProps {
	displayTodayButton?: boolean
	displayRange?: boolean
}

export interface TodaySelectionState {
	today: Date
	selectedDates: DateObjectValue
	modelValue: DateModelValue
	displayValue: string
	month: string
	year: string
	monthName: string
	yearName: string
}

export interface BuildTodaySelectionStateOptions {
	displayRange?: boolean
	format: string
	dateFormatReturn?: string
	formatDate: (date: Date | null, format: string) => string
}

export interface TodayButtonReturn {
	todayInString: ComputedRef<string>
	selectToday: (selectedDates: { value: DateObjectValue }) => void
	headerDate: ComputedRef<string>
}

export const buildTodaySelectionState = (options: BuildTodaySelectionStateOptions): TodaySelectionState => {
	const {
		displayRange = false,
		format,
		dateFormatReturn,
		formatDate,
	} = options

	const today = dayjs().startOf('day').toDate()
	const modelFormat = dateFormatReturn || format
	const displayValue = formatDate(today, format)
	const modelValue = formatDate(today, modelFormat)
	const month = today.getMonth().toString()
	const year = today.getFullYear().toString()
	const monthName = dayjs(today).format('MMMM')

	return {
		today,
		selectedDates: displayRange ? [today, today] : today,
		modelValue: displayRange ? [modelValue, modelValue] : modelValue,
		displayValue: displayRange
			? `${displayValue}${locales.rangeSeparator}${displayValue}`
			: displayValue,
		month,
		year,
		monthName,
		yearName: year,
	}
}

/**
 * Composable pour gérer le bouton "Aujourd'hui" dans le CalendarMode
 */
export function useTodayButton(props: TodayButtonProps): TodayButtonReturn {
	// Computed pour le format de la date du jour
	const todayInString = computed(() => formatDateLabel(dayjs()))

	const headerDate = computed(() => formatDateLabel(dayjs()))

	// Fonction pour sélectionner la date du jour
	const selectToday = (selectedDates: { value: DateObjectValue }) => {
		const today = dayjs().startOf('day').toDate()
		selectedDates.value = props.displayRange ? [today, today] : today
		// Le watcher sur selectedDates dans le composant parent se chargera de mettre à jour l'affichage
		// et d'émettre l'événement update:modelValue
	}

	return {
		todayInString,
		selectToday,
		headerDate,
	}
}
