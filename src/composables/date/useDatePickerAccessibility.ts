import { nextTick, onBeforeUnmount, onMounted } from 'vue'
import { locales } from '@/components/DatePicker/locales'

/**
 * Composable pour améliorer l'accessibilité du CalendarMode
 */
const DATE_PICKER_SELECTOR = '.v-date-picker'
const GRID_ROOT_SELECTOR = '.v-date-picker-month'
const DAYS_CONTAINER_SELECTOR = '.v-date-picker-month__days'

const WEEKDAY_ROW_SELECTOR = '.v-date-picker-month__weekdays'
const WEEK_ROW_SELECTOR = '.v-date-picker-month__week'

const HEADER_CELL_SELECTOR = '.v-date-picker-month__weekday'
const DAY_CELL_SELECTOR = '.v-date-picker-month__day, [data-v-date]'
const DAY_BUTTON_SELECTOR = 'button, [role="button"]'

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

const WEEKDAY_LABELS_MONDAY_FIRST = locales.weekdayLabelsMondayFirst

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

const inferColumnCount = (monthEl: HTMLElement): number => {
	const cssValue = monthEl.style.getPropertyValue('--v-date-picker-days-in-week')?.trim()
	const parsed = cssValue ? Number.parseInt(cssValue, 10) : Number.NaN

	if (Number.isFinite(parsed) && parsed > 0) return parsed

	return 7
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

const ensureControlButtonLabels = (pickerEl: HTMLElement) => {
	const monthButton = pickerEl.querySelector<HTMLButtonElement>(MONTH_CONTROL_SELECTOR)
	const yearButton = pickerEl.querySelector<HTMLButtonElement>(YEAR_CONTROL_SELECTOR)

	if (monthButton) {
		monthButton.setAttribute('aria-label', locales.openMonthSelector)
		monthButton.setAttribute('title', locales.openMonthSelector)
	}

	if (yearButton) {
		yearButton.setAttribute('aria-label', locales.openYearSelector)
		yearButton.setAttribute('title', locales.openYearSelector)
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
const ensureCalendarRows = (monthEl: HTMLElement) => {
	const daysContainer = monthEl.querySelector<HTMLElement>(DAYS_CONTAINER_SELECTOR)
	if (!daysContainer) return

	if (daysContainer.dataset.syStructured === 'true') return

	const existingRows = daysContainer.querySelectorAll<HTMLElement>(
		`${WEEKDAY_ROW_SELECTOR}, ${WEEK_ROW_SELECTOR}`,
	)

	if (existingRows.length > 0) {
		daysContainer.dataset.syStructured = 'true'
		return
	}

	const children = Array.from(daysContainer.children).filter(
		(node): node is HTMLElement => node instanceof HTMLElement,
	)

	if (children.length === 0) return

	const columnCount = inferColumnCount(monthEl)
	const headerCandidates = children.slice(0, columnCount)

	const hasHeaderRow = (
		headerCandidates.length === columnCount
		&& headerCandidates.every(cell => cell.classList.contains('v-date-picker-month__weekday'))
	)

	const fragment = document.createDocumentFragment()

	if (hasHeaderRow) {
		const headerRow = document.createElement('div')
		headerRow.classList.add('v-date-picker-month__weekdays')
		headerRow.style.display = 'contents'

		headerCandidates.forEach((cell) => {
			headerRow.appendChild(cell)
		})

		fragment.appendChild(headerRow)
	}

	const bodyCells = hasHeaderRow ? children.slice(columnCount) : children

	for (let index = 0; index < bodyCells.length; index += columnCount) {
		const rowCells = bodyCells.slice(index, index + columnCount)
		if (rowCells.length === 0) continue

		const row = document.createElement('div')
		row.classList.add('v-date-picker-month__week')
		row.style.display = 'contents'

		rowCells.forEach((cell) => {
			row.appendChild(cell)
		})

		fragment.appendChild(row)
	}

	daysContainer.replaceChildren(fragment)
	daysContainer.dataset.syStructured = 'true'
}

const isSelectedCell = (cell: HTMLElement, button: HTMLElement): boolean => (
	cell.classList.contains('v-date-picker-month__day--selected')
	|| cell.classList.contains('v-date-picker-month__day--range-start')
	|| cell.classList.contains('v-date-picker-month__day--range-end')
	|| button.classList.contains('v-btn--active')
	|| button.getAttribute('aria-selected') === 'true'
)

const isDisabledCell = (cell: HTMLElement, button: HTMLElement): boolean => (
	cell.classList.contains('v-date-picker-month__day--disabled')
	|| button.hasAttribute('disabled')
	|| button.getAttribute('aria-disabled') === 'true'
)

const assignGridCellAttributes = (cell: HTMLElement) => {
	const button = cell.querySelector<HTMLElement>(DAY_BUTTON_SELECTOR)
	if (!button) return

	const selected = isSelectedCell(cell, button)
	const disabled = isDisabledCell(cell, button)

	cell.setAttribute('role', 'gridcell')
	cell.setAttribute('aria-selected', selected ? 'true' : 'false')

	if (disabled) {
		cell.setAttribute('aria-disabled', 'true')
	}
	else {
		cell.removeAttribute('aria-disabled')
	}

	// Nettoyage des attributs qui ne doivent pas être sur le bouton.
	// Le bouton doit rester un vrai bouton.
	button.removeAttribute('role')
	button.removeAttribute('aria-rowindex')
	button.removeAttribute('aria-colindex')
	button.removeAttribute('aria-selected')

	// Nettoyage si l’ancienne version avait posé ces attributs sur la cellule.
	cell.removeAttribute('aria-rowindex')
	cell.removeAttribute('aria-colindex')
}

const ensureWeekdayHeaderLabels = (headerCells: HTMLElement[]) => {
	headerCells.forEach((cell, index) => {
		cell.setAttribute('role', 'columnheader')

		const label = WEEKDAY_LABELS_MONDAY_FIRST[index]
		if (label) {
			cell.setAttribute('aria-label', label)
		}

		cell.removeAttribute('aria-colindex')
	})
}

const ensureHolidayDayLabels = (monthEl: HTMLElement) => {
	const holidayButtons = monthEl.querySelectorAll<HTMLButtonElement>(
		'.holiday-day .v-date-picker-month__day-btn',
	)

	holidayButtons.forEach((button) => {
		const label = button.getAttribute('aria-label')
		if (!label || label.includes(locales.publicHoliday)) return

		button.setAttribute('aria-label', `${label}, ${locales.publicHoliday}`)
	})
}

const applyGridSemantics = (pickerEl: HTMLElement) => {
	const monthEls = pickerEl.querySelectorAll<HTMLElement>(GRID_ROOT_SELECTOR)
	if (monthEls.length === 0) return

	monthEls.forEach((monthEl) => {
		ensureCalendarRows(monthEl)

		const labelScope = monthEl.closest(DATE_PICKER_SELECTOR) ?? pickerEl

		monthEl.setAttribute('role', 'grid')
		monthEl.setAttribute('aria-label', inferGridLabel(labelScope))

		// Nettoyage des attributs inutiles ou trompeurs.
		monthEl.removeAttribute('aria-readonly')
		monthEl.removeAttribute('aria-colcount')
		monthEl.removeAttribute('aria-rowcount')

		const headerRow = monthEl.querySelector<HTMLElement>(WEEKDAY_ROW_SELECTOR)
		const headerCells = headerRow
			? Array.from(headerRow.querySelectorAll<HTMLElement>(HEADER_CELL_SELECTOR)).filter(cell => compactText(cell.textContent).length > 0)
			: []

		if (headerRow) {
			headerRow.setAttribute('role', 'row')
			headerRow.removeAttribute('aria-rowindex')
			ensureWeekdayHeaderLabels(headerCells)
		}

		const weekRows = Array.from(monthEl.querySelectorAll<HTMLElement>(WEEK_ROW_SELECTOR))

		weekRows.forEach((row) => {
			row.setAttribute('role', 'row')
			row.removeAttribute('aria-rowindex')

			const dayCells = Array.from(
				row.querySelectorAll<HTMLElement>(DAY_CELL_SELECTOR),
			).filter(cell => row.contains(cell))

			dayCells.forEach(assignGridCellAttributes)
		})

		ensureHolidayDayLabels(monthEl)
	})
}

const findPickerElements = (root: ParentNode): HTMLElement[] => {
	const pickerEls = Array.from(root.querySelectorAll<HTMLElement>(DATE_PICKER_SELECTOR))

	if (root instanceof HTMLElement && root.matches(DATE_PICKER_SELECTOR)) {
		return [root, ...pickerEls]
	}

	return pickerEls
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

		const pickerEls = findPickerElements(root)
		if (pickerEls.length === 0) return

		pickerEls.forEach((pickerEl) => {
			ensureNavigationButtonLabels(pickerEl)
			ensureControlButtonLabels(pickerEl)
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
		handleKeyDown,
		fixAriaAttributes,
	}
}

export default useDatePickerAccessibility
