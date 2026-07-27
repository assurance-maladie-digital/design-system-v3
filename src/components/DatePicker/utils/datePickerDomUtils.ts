import { nextTick } from 'vue'
import type { ViewMode } from '../composables/useDatePickerViewMode'

export interface ReapplyDatePickerAccessibilityOptions {
	rootEl: HTMLElement | null | undefined
	currentViewMode: ViewMode
	cleanupGridSemantics: (root?: ParentNode) => void
	updateAccessibility: (root?: ParentNode, viewMode?: ViewMode) => Promise<void> | void
}

/**
 * Réapplique les correctifs d'accessibilité ARIA injectés dans le VDatePicker
 * après un rerender Vuetify tout en restaurant le focus utilisateur.
 */
export const reapplyDatePickerAccessibility = ({
	rootEl,
	currentViewMode,
	cleanupGridSemantics,
	updateAccessibility,
}: ReapplyDatePickerAccessibilityOptions) => {
	if (!rootEl) return

	const activeElement = document.activeElement instanceof HTMLElement
		? document.activeElement
		: null
	const activeDay = activeElement?.closest<HTMLElement>('.v-date-picker-month__day[data-v-date]')
	const activeMonthButton = activeElement?.closest<HTMLButtonElement>('.v-date-picker-months .v-btn')
	const activeYearButton = activeElement?.closest<HTMLButtonElement>('.v-date-picker-years .v-btn')
	const shouldRestoreButtonFocus = activeElement?.tagName === 'BUTTON'
	const dayDate = activeDay?.getAttribute('data-v-date')
	const monthLabel = activeMonthButton?.getAttribute('aria-label') ?? activeMonthButton?.textContent?.trim() ?? ''
	const yearLabel = activeYearButton?.getAttribute('aria-label') ?? activeYearButton?.textContent?.trim() ?? ''

	cleanupGridSemantics(rootEl)

	nextTick(() => {
		void updateAccessibility(rootEl, currentViewMode)

		nextTick(() => {
			if (!activeElement || (!rootEl.contains(activeElement) && !dayDate && !monthLabel && !yearLabel)) return

			if (dayDate) {
				const dayCell = rootEl.querySelector<HTMLElement>(`.v-date-picker-month__day[data-v-date="${dayDate}"]`)
				const focusTarget = shouldRestoreButtonFocus
					? dayCell?.querySelector<HTMLElement>('button')
					: dayCell

				focusTarget?.focus({ preventScroll: true })
				return
			}

			if (monthLabel) {
				const monthButtons = Array.from(rootEl.querySelectorAll<HTMLButtonElement>('.v-date-picker-months .v-btn'))
				const target = monthButtons.find(button =>
					(button.getAttribute('aria-label') ?? button.textContent?.trim() ?? '') === monthLabel,
				)

				target?.focus({ preventScroll: true })
				return
			}

			if (yearLabel) {
				const yearButtons = Array.from(rootEl.querySelectorAll<HTMLButtonElement>('.v-date-picker-years .v-btn'))
				const target = yearButtons.find(button =>
					(button.getAttribute('aria-label') ?? button.textContent?.trim() ?? '') === yearLabel,
				)

				target?.focus({ preventScroll: true })
			}
		})
	})
}

/**
 * Attend la fin d'une transition Vuetify, avec un fallback temporel,
 * avant d'exécuter une action dépendante du DOM final.
 */
export const waitForTransitionEnd = (container: HTMLElement, callback: () => void, fallbackMs = 400) => {
	if (container.classList.contains('v-enter-active') || container.classList.contains('fade-transition-enter-active')) {
		let fired = false
		const handler = () => {
			if (fired) return

			fired = true
			clearTimeout(fallbackId)
			callback()
		}
		const fallbackId = setTimeout(handler, fallbackMs)

		container.addEventListener('transitionend', handler, { once: true })
		return
	}

	callback()
}
