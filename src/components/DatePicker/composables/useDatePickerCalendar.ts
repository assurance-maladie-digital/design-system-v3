import { type Ref, nextTick } from 'vue'
import dayjs from 'dayjs'
import { getDisplayedMonthYearState } from '../utils/dateFormattingUtils'
import type { ViewMode } from './useDatePickerViewMode'

/**
 * Options du composable `useDatePickerCalendar`.
 *
 * Centralise la logique partagée entre `ComplexDatePicker` et `CalendarMode/DatePicker`
 * pour la gestion du calendrier VDatePicker : accessibilité, transitions, navigation
 * mois/année, et synchronisation de l'affichage.
 */
export interface UseDatePickerCalendarOptions {
	/** Accès unifié à l'élément racine du calendrier (VDatePicker.$el ou dialog) */
	getRootEl: () => HTMLElement | null | undefined

	/** Visibilité du calendrier */
	isDatePickerVisible: Ref<boolean>

	// View mode (from useDatePickerViewMode)
	currentViewMode: Ref<ViewMode>
	handleViewModeUpdate: (mode: ViewMode) => void
	handleMonthUpdate: () => void
	handleYearUpdate: () => void

	// Month/Year state
	currentMonth: Ref<string | null>
	currentMonthName: Ref<string | null>
	currentYear: Ref<string | null>
	currentYearName: Ref<string | null>

	// Accessibility functions (from useDatePickerAccessibility)
	updateAccessibility: (el: HTMLElement, mode: ViewMode) => void
	cleanupGridSemantics: (el: HTMLElement) => void

	// Keyboard navigation
	focusInitialDay: () => void

	/**
	 * Rafraîchit l'UI du calendrier après un changement de mois/année.
	 * Typiquement : updateSelectedDayAria + focus.
	 */
	refreshCalendarUi: (options: { focusDay?: boolean }) => void

	/**
	 * Hook optionnel appelé lors de l'ouverture de la vue année dans
	 * `handleViewModeUpdateWrapper`. ComplexDatePicker l'utilise pour
	 * synchroniser le mois/année affiché depuis la date sélectionnée.
	 */
	onYearViewOpen?: () => void

	/**
	 * Hook optionnel pour personnaliser le focus dans la vue année.
	 * ComplexDatePicker l'utilise pour synchroniser le proxy et focaliser
	 * l'année sélectionnée. Retourne `true` si le focus a été géré.
	 */
	onYearViewFocus?: (rootEl: HTMLElement) => boolean | void

	/**
	 * Hook optionnel appelé dans `onUpdateYear` après la mise à jour de
	 * l'année, avant le refresh. ComplexDatePicker l'utilise pour le
	 * pont Dec↔Jan lors de la navigation par année.
	 */
	onYearChangeBridge?: (newYear: string, oldYear: string | null) => void
}

export interface UseDatePickerCalendarReturn {
	reapplyAccessibility: () => void
	waitForTransitionEnd: (container: HTMLElement, callback: () => void) => void
	handleViewModeUpdateWrapper: (mode: ViewMode) => void
	syncDisplayedMonthYearFromDate: (date: Date) => void
	onUpdateMonth: (month: string) => void
	onUpdateYear: (year: string) => void
}

/**
 * Centralise la logique calendrier partagée entre ComplexDatePicker et
 * CalendarMode/DatePicker : reapplyAccessibility, handleViewModeUpdateWrapper,
 * waitForTransitionEnd, syncDisplayedMonthYearFromDate, onUpdateMonth/onUpdateYear.
 */
export const useDatePickerCalendar = (options: UseDatePickerCalendarOptions): UseDatePickerCalendarReturn => {
	const {
		getRootEl,
		isDatePickerVisible,
		currentViewMode,
		handleViewModeUpdate,
		handleMonthUpdate,
		handleYearUpdate,
		currentMonth,
		currentMonthName,
		currentYear,
		currentYearName,
		updateAccessibility,
		cleanupGridSemantics,
		focusInitialDay,
		refreshCalendarUi,
		onYearViewOpen,
		onYearViewFocus,
		onYearChangeBridge,
	} = options

	/**
	 * Nettoie la sémantique grid ARIA injectée avant que Vuetify ne re-render le mois,
	 * puis la réapplique dans le prochain tick. Restaure le focus sur l'élément actif.
	 */
	const reapplyAccessibility = (): void => {
		const rootEl = getRootEl()
		if (!rootEl) return

		const activeElement = document.activeElement instanceof HTMLElement
			? document.activeElement
			: null
		const activeDay = activeElement?.closest<HTMLElement>('.v-date-picker-month__day[data-v-date]')
		const activeMonthButton = activeElement?.closest<HTMLElement>('.v-date-picker-months [data-sy-date-picker-option="month"], .v-date-picker-months .v-btn')
		const activeYearButton = activeElement?.closest<HTMLElement>('.v-date-picker-years [data-sy-date-picker-option="year"], .v-date-picker-years .v-btn')
		const shouldRestoreButtonFocus = activeElement?.tagName === 'BUTTON'
		const dayDate = activeDay?.getAttribute('data-v-date')
		const monthLabel = activeMonthButton?.getAttribute('aria-label') ?? activeMonthButton?.textContent?.trim() ?? ''
		const yearLabel = activeYearButton?.getAttribute('aria-label') ?? activeYearButton?.textContent?.trim() ?? ''
		cleanupGridSemantics(rootEl)
		nextTick(() => {
			updateAccessibility(rootEl, currentViewMode.value)
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
					const monthButtons = Array.from(rootEl.querySelectorAll<HTMLElement>('.v-date-picker-months [data-sy-date-picker-option="month"], .v-date-picker-months .v-btn'))
					const target = monthButtons.find(button =>
						(button.getAttribute('aria-label') ?? button.textContent?.trim() ?? '') === monthLabel,
					)
					target?.focus({ preventScroll: true })
					return
				}

				if (yearLabel) {
					const yearButtons = Array.from(rootEl.querySelectorAll<HTMLElement>('.v-date-picker-years [data-sy-date-picker-option="year"], .v-date-picker-years .v-btn'))
					const target = yearButtons.find(button =>
						(button.getAttribute('aria-label') ?? button.textContent?.trim() ?? '') === yearLabel,
					)
					target?.focus({ preventScroll: true })
				}
			})
		})
	}

	/**
	 * Attend la fin d'une transition CSS avant d'exécuter le callback.
	 * Fallback de 400ms si l'événement transitionend ne se déclenche pas.
	 */
	const waitForTransitionEnd = (container: HTMLElement, callback: () => void): void => {
		if (container.classList.contains('v-enter-active') || container.classList.contains('fade-transition-enter-active')) {
			let fired = false
			const handler = () => {
				if (fired) return
				fired = true
				clearTimeout(fallbackId)
				callback()
			}
			const fallbackId = setTimeout(handler, 400)
			container.addEventListener('transitionend', handler, { once: true })
		}
		else {
			callback()
		}
	}

	/**
	 * Synchronise le mois et l'année affichés à partir d'une date.
	 * Version de base : met à jour les refs sans effets de bord.
	 */
	const syncDisplayedMonthYearFromDate = (date: Date): void => {
		const displayedState = getDisplayedMonthYearState(date)
		currentMonth.value = displayedState.month
		currentMonthName.value = displayedState.monthName
		currentYear.value = displayedState.year
		currentYearName.value = displayedState.yearName
	}

	/**
	 * Gère le changement de mode d'affichage (year → months → month) avec
	 * réapplication de l'accessibilité et gestion du focus après transition.
	 */
	const handleViewModeUpdateWrapper = (mode: ViewMode): void => {
		handleViewModeUpdate(mode)
		reapplyAccessibility()
		if (mode === 'month') {
			nextTick(() => {
				if (isDatePickerVisible.value) {
					const rootEl = getRootEl()
					if (!rootEl) return
					const monthContainer = rootEl.querySelector<HTMLElement>('.v-date-picker-month')
					if (!monthContainer) {
						focusInitialDay()
						return
					}

					waitForTransitionEnd(monthContainer, () => focusInitialDay())
				}
			})
		}
		if (mode === 'months') {
			nextTick(() => {
				const rootEl = getRootEl()
				if (!rootEl) return
				const monthsContainer = rootEl.querySelector<HTMLElement>('.v-date-picker-months')
				if (!monthsContainer) return

				const focusActiveMonth = () => {
					const active = rootEl.querySelector<HTMLElement>('.v-date-picker-months [data-sy-date-picker-option="month"][aria-pressed="true"]')
						?? rootEl.querySelector<HTMLElement>('.v-date-picker-months .v-btn--active')
					if (active) {
						active.focus({ preventScroll: true })
						return
					}
					const monthIndex = currentMonth.value !== null ? Number(currentMonth.value) : new Date().getMonth()
					const monthBtns = rootEl.querySelectorAll<HTMLElement>('.v-date-picker-months [data-sy-date-picker-option="month"], .v-date-picker-months .v-btn')
					monthBtns[monthIndex]?.focus({ preventScroll: true })
				}

				waitForTransitionEnd(monthsContainer, focusActiveMonth)
			})
		}
		if (mode === 'year') {
			nextTick(() => {
				const rootEl = getRootEl()
				if (!rootEl) return
				const yearsContainer = rootEl.querySelector<HTMLElement>('.v-date-picker-years')
				if (!yearsContainer) return

				// Hook optionnel pour la logique spécifique à ComplexDatePicker
				onYearViewOpen?.()

				const focusActiveYear = () => {
					// Hook optionnel : si il gère le focus, on s'arrête
					if (onYearViewFocus && onYearViewFocus(rootEl)) return

					const active = rootEl.querySelector<HTMLElement>('.v-date-picker-years [data-sy-date-picker-option="year"][aria-pressed="true"]')
						?? rootEl.querySelector<HTMLElement>('.v-date-picker-years .v-btn--active')
					if (active) {
						active.focus({ preventScroll: true })
						return
					}
					const currentYearBtn = rootEl.querySelector<HTMLElement>('.v-date-picker-years [data-sy-date-picker-option="year"], .v-date-picker-years .v-date-picker-years__year--current .v-btn')
					if (currentYearBtn) {
						currentYearBtn.focus({ preventScroll: true })
						return
					}
					const firstBtn = rootEl.querySelector<HTMLElement>('.v-date-picker-years [data-sy-date-picker-option="year"], .v-date-picker-years .v-btn')
					firstBtn?.focus({ preventScroll: true })
				}

				waitForTransitionEnd(yearsContainer, focusActiveYear)
			})
		}
	}

	/**
	 * Gère la mise à jour du mois depuis la navigation VDatePicker.
	 */
	const onUpdateMonth = (month: string): void => {
		if (currentMonth.value === month) return
		currentMonth.value = month
		currentMonthName.value = dayjs().month(parseInt(month, 10)).format('MMMM')
		handleMonthUpdate()

		const activeEl = document.activeElement
		const isNavButton = activeEl?.closest('[data-testid="prev-month"], [data-testid="next-month"]')
		nextTick(() => refreshCalendarUi({ focusDay: !isNavButton }))
	}

	/**
	 * Gère la mise à jour de l'année depuis la navigation VDatePicker.
	 * Inclut un hook optionnel pour le pont Dec↔Jan (ComplexDatePicker).
	 */
	const onUpdateYear = (year: string): void => {
		const oldYear = currentYear.value
		currentYear.value = year
		currentYearName.value = year

		onYearChangeBridge?.(year, oldYear)

		handleYearUpdate()

		const activeEl = document.activeElement
		const isNavButton = activeEl?.closest('[data-testid="prev-month"], [data-testid="next-month"]')
		nextTick(() => refreshCalendarUi({ focusDay: !isNavButton }))
	}

	return {
		reapplyAccessibility,
		waitForTransitionEnd,
		handleViewModeUpdateWrapper,
		syncDisplayedMonthYearFromDate,
		onUpdateMonth,
		onUpdateYear,
	}
}
