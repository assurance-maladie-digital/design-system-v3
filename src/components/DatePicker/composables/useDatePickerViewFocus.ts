import { nextTick, watch, type Ref } from 'vue'
import type { ViewMode } from './useDatePickerViewMode'

export interface UseDatePickerViewFocusOptions {
	currentViewMode: Ref<ViewMode>
	isDatePickerVisible: Ref<boolean>
	rootElement: Ref<HTMLElement | null>
}

export interface UseDatePickerViewFocusResult {
	focusSelectedViewButton: () => void
}

const SELECTORS: Record<string, string> = {
	year: '.v-date-picker-years button.v-btn--active, .v-date-picker-years button[aria-pressed="true"]',
	months: '.v-date-picker-months button.v-btn--active, .v-date-picker-months button[aria-pressed="true"]',
	month: '.v-date-picker-month__day--selected .v-btn',
}

/**
 * Met le focus et défile jusqu'au bouton actif/sélectionné quand le DatePicker
 * passe en mode année ou mois.
 */
export const useDatePickerViewFocus = (
	options: UseDatePickerViewFocusOptions,
): UseDatePickerViewFocusResult => {
	const { currentViewMode, isDatePickerVisible, rootElement } = options

	const focusSelectedViewButton = () => {
		if (!isDatePickerVisible.value) return
		const mode = currentViewMode.value
		if (!mode) return
		const selector = SELECTORS[mode]
		if (!selector) return

		nextTick(() => {
			const root = rootElement.value
			if (!root) return

			const activeButton = root.querySelector<HTMLButtonElement>(selector)
			if (!activeButton) return

			activeButton.scrollIntoView({ block: 'center', inline: 'center' })
			activeButton.focus({ preventScroll: true })
		})
	}

	watch(currentViewMode, (mode, previousMode) => {
		if (mode && mode !== previousMode && (mode === 'year' || mode === 'months')) {
			focusSelectedViewButton()
		}
	})

	return {
		focusSelectedViewButton,
	}
}
