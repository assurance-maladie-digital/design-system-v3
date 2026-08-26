/**
 * useDatePickerFocusTrap — Gestion du focus dans le dialog du calendrier.
 *
 * ## Rôle
 *
 * Ce composable implémente le **focus trap** du calendrier DatePicker, conforme
 * au pattern APG (ARIA Authoring Practices Guide) du W3C pour les date pickers.
 *
 * Il garantit que :
 * - **Tab / Shift+Tab** cyclent à l'intérieur du dialog (le focus ne sort jamais)
 * - **Escape** ferme le calendrier et restaure le focus sur l'input
 * - Le **tab order logique** respecte l'ordre visuel : entête → grille des jours → bouton Aujourd'hui
 *
 * ## Ordre logique du focus
 *
 * Le composable construit un ordre de tabulation personnalisé via `getLogicalFocusOrder` :
 * 1. Boutons d'entête (mois/année précédents, suivants, titre)
 * 2. **Grille des jours** (un seul jour reçoit `tabindex=0`, les autres `-1`)
 * 3. Bouton « Aujourd'hui »
 *
 * La grille est traitée comme un **roving tabindex** : un seul jour est focusable
 * via Tab, la navigation intra-grille se fait par flèches (géré par `useCalendarKeyboardNavigation`).
 *
 * ## Sélecteurs
 *
 * Le composable utilise des sélecteurs spécifiques pour les proxies personnalisés
 * (`data-sy-date-picker-option`) créés par `useDatePickerAccessibility`, avec
 * fallback sur les boutons natifs Vuetify (`.v-btn`).
 */
import { type ComponentPublicInstance, type Ref } from 'vue'

import dayjs from 'dayjs'

interface UseDatePickerFocusTrapOptions {
	isDatePickerVisible: Ref<boolean>
	datePickerRef: Ref<ComponentPublicInstance | null>
	onClose?: () => void | Promise<void>
	restoreFocus?: () => void
	// Renvoie la date sur laquelle placer le focus (date sélectionnée ou aujourd'hui)
	getInitialFocusDate?: () => Date
}

const DATE_PICKER_GRID_SELECTOR = '.v-date-picker-month, .v-date-picker-months, .v-date-picker-years'
const DATE_PICKER_GRID_SOURCE_SELECTOR = '.v-date-picker-months, .v-date-picker-years, .v-date-picker-month'
const TODAY_BUTTON_SELECTOR = '.date-picker__today-button'
const MONTH_PROXY_SELECTOR = '[data-sy-date-picker-option="month"]'
const YEAR_PROXY_SELECTOR = '[data-sy-date-picker-option="year"]'

const getFocusableElements = (root: HTMLElement): HTMLElement[] => {
	const allFocusable = Array.from(
		root.querySelectorAll<HTMLElement>('button,[href],input,select,textarea,[tabindex]'),
	)

	return allFocusable.filter(el =>
		!el.hasAttribute('disabled')
		&& el.getAttribute('aria-hidden') !== 'true'
		&& el.tabIndex !== -1,
	)
}

const getDayGridFocusTarget = (root: HTMLElement, getInitialFocusDate?: () => Date): HTMLElement | null => {
	const targetDate = getInitialFocusDate ? getInitialFocusDate() : new Date()
	const iso = dayjs(targetDate).format('YYYY-MM-DD')
	const dayCell = root.querySelector<HTMLElement>(`[data-v-date="${iso}"][role="gridcell"], [data-v-date="${iso}"]`)
	if (dayCell && !dayCell.hasAttribute('tabindex')) {
		dayCell.setAttribute('tabindex', '-1')
	}

	return dayCell
}

const getLogicalFocusOrder = (
	root: HTMLElement,
	getInitialFocusDate?: () => Date,
): HTMLElement[] => {
	const focusables = getFocusableElements(root)
	const dayGrid = root.querySelector<HTMLElement>('.v-date-picker-month')
	if (!dayGrid) return focusables

	const gridTarget = getDayGridFocusTarget(root, getInitialFocusDate)
	if (!gridTarget) return focusables

	const todayButton = root.querySelector<HTMLElement>(TODAY_BUTTON_SELECTOR)
	const order: HTMLElement[] = []
	let insertedGrid = false

	for (const focusable of focusables) {
		if (
			!insertedGrid
			&& todayButton
			&& focusable === todayButton
		) {
			order.push(gridTarget)
			insertedGrid = true
		}

		if (!dayGrid.contains(focusable)) {
			order.push(focusable)
		}
	}

	if (!insertedGrid) {
		order.push(gridTarget)
	}

	return order
}

const focusElement = (element: HTMLElement | null | undefined): boolean => {
	if (!element) return false
	element.focus({ preventScroll: true })
	return true
}

export function useDatePickerFocusTrap(options: UseDatePickerFocusTrapOptions) {
	const {
		isDatePickerVisible,
		datePickerRef,
		onClose,
		restoreFocus,
		getInitialFocusDate,
	} = options

	const getRootElement = (): HTMLElement | null => {
		const root = datePickerRef.value?.$el
		return root instanceof HTMLElement ? root : null
	}

	const focusDayButton = (root: HTMLElement): boolean => {
		const dayCell = getDayGridFocusTarget(root, getInitialFocusDate)
		return focusElement(dayCell)
	}

	const focusMonthButton = (root: HTMLElement): boolean => {
		const activeMonth = root.querySelector<HTMLElement>('.v-date-picker-months [data-sy-date-picker-option="month"][aria-pressed="true"]')
			?? root.querySelector<HTMLElement>('.v-date-picker-months .v-btn--active')
		if (focusElement(activeMonth)) return true

		const targetDate = getInitialFocusDate ? getInitialFocusDate() : new Date()
		const monthButtons = Array.from(root.querySelectorAll<HTMLElement>(`.v-date-picker-months ${MONTH_PROXY_SELECTOR}`))
		if (monthButtons.length > 0) {
			return focusElement(monthButtons[targetDate.getMonth()] ?? null)
		}

		const fallbackButtons = Array.from(root.querySelectorAll<HTMLElement>('.v-date-picker-months .v-btn'))
		return focusElement(fallbackButtons[targetDate.getMonth()] ?? null)
	}

	const focusYearButton = (root: HTMLElement): boolean => {
		const targetDate = getInitialFocusDate ? getInitialFocusDate() : new Date()
		const targetYear = String(targetDate.getFullYear())
		const yearButtons = Array.from(root.querySelectorAll<HTMLElement>(`.v-date-picker-years ${YEAR_PROXY_SELECTOR}`))
		const matchingProxy = yearButtons.find(button =>
			(button.getAttribute('aria-label') ?? button.textContent ?? '').trim() === targetYear,
		)
		if (focusElement(matchingProxy ?? null)) return true

		const fallbackButtons = Array.from(root.querySelectorAll<HTMLElement>('.v-date-picker-years .v-btn'))
		const matchingYear = fallbackButtons.find(button =>
			(button.getAttribute('aria-label') ?? button.textContent ?? '').trim() === targetYear,
		)
		return focusElement(matchingYear ?? null)
			|| focusElement(
				root.querySelector<HTMLElement>('.v-date-picker-years [aria-pressed="true"]')
				?? root.querySelector<HTMLElement>('.v-date-picker-years .v-btn--active'),
			)
	}

	const focusCurrentGridSelection = (root: HTMLElement): boolean => {
		if (root.querySelector('.v-date-picker-years')) {
			return focusYearButton(root)
		}

		if (root.querySelector('.v-date-picker-months')) {
			return focusMonthButton(root)
		}

		return focusDayButton(root)
	}

	const handleMenuKeydown = (event: KeyboardEvent) => {
		if (!isDatePickerVisible.value) return

		if (event.key === 'Escape' || event.key === 'Esc') {
			if (onClose) {
				void onClose()
			}
			else {
				isDatePickerVisible.value = false
				restoreFocus?.()
			}
			event.preventDefault()
			event.stopPropagation()
			return
		}

		if (event.key !== 'Tab') return

		if (event.ctrlKey || event.altKey || event.metaKey) return

		const root = getRootElement()
		if (!root) return

		event.preventDefault()
		event.stopPropagation()

		const target = event.target as HTMLElement | null
		const todayButton = root.querySelector<HTMLElement>(TODAY_BUTTON_SELECTOR)
		const focusables = getLogicalFocusOrder(root, getInitialFocusDate)
		const firstFocusable = focusables[0]
		const lastFocusable = focusables.at(-1)

		if (!firstFocusable) return

		const active = document.activeElement as HTMLElement | null

		const isFromGrid = Boolean(target?.closest(DATE_PICKER_GRID_SOURCE_SELECTOR))
		const isFromTodayButton = Boolean(target?.closest(TODAY_BUTTON_SELECTOR))
		const gridTarget = root.querySelector<HTMLElement>('.v-date-picker-month [role="gridcell"][tabindex="-1"], .v-date-picker-month [data-v-date][tabindex="-1"]')
			?? getDayGridFocusTarget(root, getInitialFocusDate)

		// Tab depuis la grille → bouton Aujourd'hui
		if (!event.shiftKey && isFromGrid && todayButton) {
			todayButton.focus({ preventScroll: true })
			return
		}

		// Shift+Tab depuis la grille → précédent élément logique avant la grille
		if (event.shiftKey && isFromGrid && active) {
			const gridContainer = active.closest(DATE_PICKER_GRID_SELECTOR)
			const gridIndex = gridTarget ? focusables.indexOf(gridTarget) : -1
			const startIndex = gridIndex !== -1 ? gridIndex : focusables.indexOf(active)

			for (let offset = 1; offset <= focusables.length; offset++) {
				const candidate = focusables[(startIndex - offset + focusables.length) % focusables.length]
				if (!candidate) continue
				if (!gridContainer?.contains(candidate)) {
					candidate.focus({ preventScroll: true })
					break
				}
			}
			return
		}

		// Shift+Tab depuis le bouton Aujourd'hui → jour sélectionné dans la grille
		if (event.shiftKey && isFromTodayButton) {
			if (focusCurrentGridSelection(root)) return
		}

		const currentIndex = active ? focusables.indexOf(active) : -1

		if (currentIndex === -1 && active) {
			const preceding = focusables.filter(el =>
				Boolean(active.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_PRECEDING),
			)

			const following = focusables.filter(el =>
				Boolean(active.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING),
			)

			if (event.shiftKey) {
				const prev = preceding.at(-1) ?? lastFocusable
				prev?.focus({ preventScroll: true })
			}
			else {
				const next = following[0] ?? firstFocusable
				next.focus({ preventScroll: true })
			}

			return
		}

		const safeIndex = currentIndex === -1 ? 0 : currentIndex

		const nextIndex = event.shiftKey
			? (safeIndex - 1 + focusables.length) % focusables.length
			: (safeIndex + 1) % focusables.length

		const nextFocusable = focusables[nextIndex]

		if (nextFocusable?.closest(DATE_PICKER_GRID_SELECTOR)) {
			if (focusCurrentGridSelection(root)) return
		}

		nextFocusable?.focus({ preventScroll: true })
	}

	return { handleMenuKeydown }
}
