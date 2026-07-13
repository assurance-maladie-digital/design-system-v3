import { nextTick, type Ref } from 'vue'

export interface UseSelectedDayAriaOptions {
	rootElement: Ref<HTMLElement | null>
}

export interface UseSelectedDayAriaResult {
	updateSelectedDayAria: () => void
}

/**
 * Nettoie les attributs ARIA redondants au niveau des boutons de jour.
 * L'état de sélection est exposé par la cellule `gridcell` via `aria-selected`.
 * Les boutons internes ne doivent pas utiliser `aria-pressed` ni `aria-selected`.
 */
export const useSelectedDayAria = (
	options: UseSelectedDayAriaOptions,
): UseSelectedDayAriaResult => {
	const { rootElement } = options

	const updateSelectedDayAria = () => {
		nextTick(() => {
			const root = rootElement.value
			if (!root) return

			const allDayButtons = root.querySelectorAll<HTMLElement>('.v-date-picker-month__day .v-btn')

			allDayButtons.forEach((button) => {
				button.removeAttribute('aria-pressed')
				button.removeAttribute('aria-selected')
			})
		})
	}

	return {
		updateSelectedDayAria,
	}
}
