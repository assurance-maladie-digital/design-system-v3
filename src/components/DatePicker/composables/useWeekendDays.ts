import { computed, type ComputedRef } from 'vue'

export interface WeekendDaysProps {
	displayWeekendDays?: boolean
}

export interface WeekendDaysReturn {
	displayWeekendDays: ComputedRef<boolean>
}

/**
 * Composable pour gérer l'affichage des jours de weekend dans le DatePicker
 */
export function useWeekendDays(props: WeekendDaysProps): WeekendDaysReturn {
	// Computed pour l'affichage des jours de weekend
	const displayWeekendDays = computed(() => props.displayWeekendDays ?? true)

	return {
		displayWeekendDays,
	}
}
