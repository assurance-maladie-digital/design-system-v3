import { nextTick, type Ref } from 'vue'

export interface UseSelectedDayAriaOptions {
	rootElement: Ref<HTMLElement | null>
}

export interface UseSelectedDayAriaResult {
	updateSelectedDayAria: () => void
}

/**
 * Ajoute `aria-pressed="true"` sur le bouton du jour sélectionné du VDatePicker,
 * et retire l'attribut des autres boutons de jour.
 */
export const useSelectedDayAria = (
	options: UseSelectedDayAriaOptions,
): UseSelectedDayAriaResult => {
	const { rootElement } = options

	const updateSelectedDayAria = () => {
		nextTick(() => {
			const root = rootElement.value
			if (!root) return

			const selectedButtons = root.querySelectorAll<HTMLElement>(
				'.v-date-picker-month__day--selected .v-btn',
			)
			const allDayButtons = root.querySelectorAll<HTMLElement>('.v-date-picker-month__day .v-btn')

			allDayButtons.forEach((button) => {
				button.removeAttribute('aria-pressed')
				button.removeAttribute('aria-selected')
			})

			selectedButtons.forEach((button) => {
				button.setAttribute('aria-pressed', 'true')
			})
		})
	}

	return {
		updateSelectedDayAria,
	}
}
