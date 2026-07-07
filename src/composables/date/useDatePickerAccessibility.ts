import { nextTick, onBeforeUnmount, onMounted } from 'vue'
import { locales } from '@/components/DatePicker/locales'

/**
 * Composable pour améliorer l'accessibilité du CalendarMode
 */

const MONTH_CONTROL_SELECTOR = [
	'[data-testid="month-btn"]',
	'.v-date-picker-controls__month-btn',
].join(',')

const YEAR_CONTROL_SELECTOR = [
	'[data-testid="year-btn"]',
	'.v-date-picker-controls__mode-btn',
	'.v-date-picker-controls__year-btn',
].join(',')

const PREV_MONTH_BUTTON_SELECTOR = [
	'[data-testid="prev-month"]',
	'.v-date-picker-controls__month button:first-of-type',
].join(',')

const NEXT_MONTH_BUTTON_SELECTOR = [
	'[data-testid="next-month"]',
	'.v-date-picker-controls__month button:last-of-type',
].join(',')

const WEEKDAY_LABELS = locales.weekdayLabelsMondayFirst

const MONTH_ACCESSIBLE_NAMES: Record<string, string> = {
	'janvier': locales.monthNames[0]!,
	'janv.': locales.monthNames[0]!,
	'février': locales.monthNames[1]!,
	'févr.': locales.monthNames[1]!,
	'mars': locales.monthNames[2]!,
	'avril': locales.monthNames[3]!,
	'avr.': locales.monthNames[3]!,
	'mai': locales.monthNames[4]!,
	'juin': locales.monthNames[5]!,
	'juillet': locales.monthNames[6]!,
	'juil.': locales.monthNames[6]!,
	'août': locales.monthNames[7]!,
	'septembre': locales.monthNames[8]!,
	'sept.': locales.monthNames[8]!,
	'octobre': locales.monthNames[9]!,
	'oct.': locales.monthNames[9]!,
	'novembre': locales.monthNames[10]!,
	'nov.': locales.monthNames[10]!,
	'décembre': locales.monthNames[11]!,
	'déc.': locales.monthNames[11]!,
	'dec.': locales.monthNames[11]!,
}

const DEFAULT_GRID_LABEL = locales.defaultGridLabel

const compactText = (value: string | null | undefined): string => (
	value?.replace(/\s+/g, ' ').trim() ?? ''
)

const expandMonthAccessibleName = (value: string): string => {
	const normalized = value.toLocaleLowerCase('fr-FR')
	return MONTH_ACCESSIBLE_NAMES[normalized] ?? normalized
}

const inferMonthYearLabel = (pickerEl: Element): string => {
	const monthButton = pickerEl.querySelector<HTMLElement>(MONTH_CONTROL_SELECTOR)
	const yearButton = pickerEl.querySelector<HTMLElement>(YEAR_CONTROL_SELECTOR)

	const monthText = compactText(monthButton?.textContent)
	const yearText = compactText(yearButton?.textContent)

	if (monthText && yearText) {
		return `${expandMonthAccessibleName(monthText)} ${yearText}`
	}

	const liveHeading = pickerEl.querySelector<HTMLElement>(
		'.v-picker__header [aria-live="polite"], .v-picker__header .sy-heading',
	)

	const headingText = compactText(liveHeading?.textContent)
	if (headingText) return headingText

	return ''
}

const inferGridLabel = (scope: Element): string => {
	const monthYearLabel = inferMonthYearLabel(scope)

	if (monthYearLabel) {
		return locales.gridLabelWithMonthYear(monthYearLabel)
	}

	const title = scope.querySelector<HTMLElement>('.v-picker-title, .v-date-picker-title')
	const titleText = compactText(title?.textContent)

	if (titleText) return titleText

	return DEFAULT_GRID_LABEL
}

const ensureNavigationButtonLabels = (pickerEl: HTMLElement) => {
	const prevButton = pickerEl.querySelector<HTMLButtonElement>(PREV_MONTH_BUTTON_SELECTOR)
	const nextButton = pickerEl.querySelector<HTMLButtonElement>(NEXT_MONTH_BUTTON_SELECTOR)

	if (prevButton) {
		prevButton.setAttribute('aria-label', locales.previousMonth)
		prevButton.setAttribute('title', locales.previousMonth)
	}

	if (nextButton) {
		nextButton.setAttribute('aria-label', locales.nextMonth)
		nextButton.setAttribute('title', locales.nextMonth)
	}
}

const ensureMonthAndYearSelectorLabels = (pickerEl: HTMLElement) => {
	const monthButtons = pickerEl.querySelectorAll<HTMLButtonElement>('.v-date-picker-months button')

	monthButtons.forEach((button) => {
		const text = compactText(button.textContent)
		if (!text) return

		const monthLabel = expandMonthAccessibleName(text)
		const ariaLabel = locales.selectMonthWithYear(monthLabel)

		button.setAttribute('aria-label', ariaLabel)
		button.setAttribute('title', ariaLabel)
	})

	const yearButtons = pickerEl.querySelectorAll<HTMLButtonElement>('.v-date-picker-years button')

	yearButtons.forEach((button) => {
		const text = compactText(button.textContent)
		if (!text) return

		const ariaLabel = locales.selectYear(text)

		button.setAttribute('aria-label', ariaLabel)
		button.setAttribute('title', ariaLabel)
	})
}

/**
 * Structure les éléments du calendrier avec des wrappers ARIA en display: contents.
 *
 * On évite volontairement de créer une table avec role="presentation".
 * La grille reste une grille ARIA en div :
 * - .v-date-picker-month => role="grid"
 * - lignes => role="row"
 * - jours de semaine => role="columnheader"
 * - cellules de date => role="gridcell"
 * - boutons de date => restent de vrais boutons
 */
const createAriaRow = (className?: string): HTMLElement => {
	const row = document.createElement('div')
	row.setAttribute('role', 'row')
	row.style.display = 'contents'
	if (className) row.className = className
	return row
}

const cleanupGridSemanticsForMonth = (daysContainer: HTMLElement) => {
	Array.from(daysContainer.children).forEach((child) => {
		if (
			child instanceof HTMLElement
			&& child.getAttribute('role') === 'row'
			&& child.style.display === 'contents'
		) {
			while (child.firstChild) {
				daysContainer.appendChild(child.firstChild)
			}
			child.remove()
		}
	})
}

const applyGridSemantics = (pickerEl: HTMLElement) => {
	const monthEls = pickerEl.querySelectorAll<HTMLElement>('.v-date-picker-month')

	monthEls.forEach((monthEl) => {
		const daysContainer = monthEl.querySelector<HTMLElement>('.v-date-picker-month__days')
		if (!daysContainer) return

		monthEl.setAttribute('role', 'grid')
		monthEl.setAttribute('aria-label', inferGridLabel(pickerEl))

		monthEl.removeAttribute('aria-readonly')
		monthEl.removeAttribute('aria-rowcount')
		monthEl.removeAttribute('aria-colcount')

		const allChildren = Array.from(daysContainer.children).filter(
			(child): child is HTMLElement => child instanceof HTMLElement,
		)

		const weekdayCells = allChildren.filter(cell =>
			cell.classList.contains('v-date-picker-month__weekday'),
		)

		const dayCells = allChildren.filter(cell =>
			cell.hasAttribute('data-v-date'),
		)

		const colCount = weekdayCells.length || 7

		cleanupGridSemanticsForMonth(daysContainer)

		if (weekdayCells.length > 0) {
			const headerRow = createAriaRow('v-date-picker-month__weekdays')
			weekdayCells.forEach((cell, index) => {
				cell.setAttribute('role', 'columnheader')

				const label = WEEKDAY_LABELS[index]
				if (label) {
					cell.setAttribute('aria-label', label)
				}

				cell.removeAttribute('aria-colindex')
				cell.removeAttribute('aria-rowindex')
				headerRow.appendChild(cell)
			})
			daysContainer.insertBefore(headerRow, daysContainer.firstChild)
		}

		for (let i = 0; i < dayCells.length; i += colCount) {
			const row = createAriaRow('v-date-picker-month__week')
			const chunk = dayCells.slice(i, i + colCount)
			chunk.forEach((cell) => {
				const button = cell.querySelector<HTMLButtonElement>('button')
				if (!button) return

				cell.setAttribute('role', 'gridcell')
				cell.setAttribute(
					'aria-selected',
					button.classList.contains('v-btn--active') ? 'true' : 'false',
				)

				button.removeAttribute('role')
				button.removeAttribute('aria-selected')
				button.removeAttribute('aria-rowindex')
				button.removeAttribute('aria-colindex')
				row.appendChild(cell)
			})
			daysContainer.appendChild(row)
		}
	})
}

const cleanupGridSemantics = (root: ParentNode = document) => {
	const pickerEls = Array.from(root.querySelectorAll<HTMLElement>('.v-date-picker'))

	if (root instanceof HTMLElement && root.matches('.v-date-picker')) {
		pickerEls.unshift(root)
	}

	pickerEls.forEach((pickerEl) => {
		pickerEl.querySelectorAll<HTMLElement>('.v-date-picker-month__days').forEach((daysContainer) => {
			cleanupGridSemanticsForMonth(daysContainer)
		})
	})
}

/**
 * Améliore l'accessibilité du CalendarMode en ajoutant des attributs ARIA
 * et des libellés utiles pour les lecteurs d'écran.
 */
export function useDatePickerAccessibility() {
	/**
	 * Met à jour les attributs d'accessibilité du CalendarMode.
	 *
	 * Un root peut être passé pour limiter le patch à une zone précise.
	 * Sans root, on garde le comportement historique : tous les date pickers du document sont traités.
	 */
	const updateAccessibility = async (root: ParentNode = document): Promise<void> => {
		await nextTick()

		const pickerEls = Array.from(root.querySelectorAll<HTMLElement>('.v-date-picker'))

		if (root instanceof HTMLElement && root.matches('.v-date-picker')) {
			pickerEls.unshift(root)
		}

		pickerEls.forEach((pickerEl) => {
			ensureNavigationButtonLabels(pickerEl)
			ensureMonthAndYearSelectorLabels(pickerEl)
			applyGridSemantics(pickerEl)
		})
	}

	/**
	 * Conservé pour compatibilité avec les appels existants.
	 *
	 * On ne supprime plus globalement aria-expanded / aria-haspopup,
	 * pour éviter de casser les combobox ou les menus.
	 */
	const fixAriaAttributes = () => {
		// noop volontaire
	}

	/**
	 * Gestion clavier plus sûre.
	 *
	 * Les vrais boutons gèrent déjà Entrée nativement :
	 * on ne simule donc un clic que pour les éléments non natifs.
	 */
	const handleKeyDown = (event: KeyboardEvent) => {
		if (event.key !== 'Enter') return

		const target = event.target
		if (!(target instanceof HTMLElement)) return

		const isNativeInteractive = target.matches(
			'button, a[href], input, select, textarea',
		)

		if (isNativeInteractive) return

		const role = target.getAttribute('role')

		if (role === 'button') {
			event.preventDefault()
			target.click()
			return
		}

		if (role === 'gridcell') {
			const button = target.querySelector<HTMLButtonElement>('button')
			if (!button) return

			event.preventDefault()
			button.click()
		}
	}

	const setupMutationObserver = () => {
		// noop volontaire
	}

	onMounted(() => {
		fixAriaAttributes()
		setupMutationObserver()
	})

	onBeforeUnmount(() => {
		// noop volontaire
	})

	return {
		updateAccessibility,
		cleanupGridSemantics,
		handleKeyDown,
		fixAriaAttributes,
	}
}

export default useDatePickerAccessibility
