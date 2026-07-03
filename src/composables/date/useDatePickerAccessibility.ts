/**
 * Composable pour améliorer l'accessibilité du CalendarMode
 */
import { nextTick, onBeforeUnmount, onMounted } from 'vue'

const GRID_ROOT_SELECTOR = '.v-date-picker-month'
const WEEKDAY_ROW_SELECTOR = '.v-date-picker-month__weekdays'
const WEEK_ROW_SELECTOR = '.v-date-picker-month__week'
const HEADER_CELL_SELECTOR = '.v-date-picker-month__weekday'
const DAY_CELL_SELECTOR = '.v-date-picker-month__day, [data-v-date]'
const DAY_BUTTON_SELECTOR = 'button, [role="button"]'

const DEFAULT_GRID_LABEL = 'Calendrier des dates'

const compactText = (value: string | null | undefined): string => value?.replace(/\s+/g, ' ').trim() ?? ''

const inferGridLabel = (scope: Element): string => {
	const labelSelectors = [
		'.v-picker-title',
		'.v-date-picker-title',
		'.v-picker__header [aria-live="polite"]',
		'.v-date-picker-header [aria-live="polite"]',
		'.v-picker__header .sy-heading',
		'.v-date-picker-header .sy-heading',
		'.v-date-picker-controls__month-btn',
	]

	for (const selector of labelSelectors) {
		const element = scope.querySelector<HTMLElement>(selector)
		const text = compactText(element?.textContent ?? undefined)
		if (text) return text
	}

	return DEFAULT_GRID_LABEL
}

const ensureNavigationButtonLabels = (pickerEl: HTMLElement) => {
	const navButtons = pickerEl.querySelectorAll<HTMLButtonElement>('.v-date-picker-header button')
	navButtons.forEach((button) => {
		const icon = button.querySelector('i')
		if (icon?.classList.contains('mdi-chevron-left')) {
			button.setAttribute('aria-label', 'Mois précédent')
			return
		}

		if (icon?.classList.contains('mdi-chevron-right')) {
			button.setAttribute('aria-label', 'Mois suivant')
			return
		}

		button.removeAttribute('aria-label')
	})
}

const ensureWeekdayHeaderInThead = (monthEl: HTMLElement) => {
	const daysContainer = monthEl.querySelector<HTMLElement>('.v-date-picker-month__days')
	if (!daysContainer) return
	if (daysContainer.dataset.syStructured === 'true') return

	const allCells = Array.from(daysContainer.children).filter((node): node is HTMLElement => node instanceof HTMLElement)
	if (allCells.length === 0) return

	const headerCandidates = allCells.slice(0, 7)
	const hasHeaderRow = headerCandidates.length === 7 && headerCandidates.every(cell => cell.classList.contains('v-date-picker-month__weekday'))

	const resolvedColumnCount = hasHeaderRow
		? headerCandidates.length
		: Math.max(1, Number.parseInt(monthEl.style.getPropertyValue('--v-date-picker-days-in-week') || '7', 10) || 7)

	const table = document.createElement('table')
	table.dataset.syStructured = 'true'
	table.setAttribute('role', 'presentation')
	table.style.display = 'contents'

	const thead = document.createElement('thead')
	thead.style.display = 'contents'

	const tbody = document.createElement('tbody')
	tbody.style.display = 'contents'

	const ensureDisplayContents = (element: HTMLElement) => {
		element.style.display = 'contents'
	}

	const elementsWithDisplayContents: HTMLElement[] = [table, thead, tbody]
	elementsWithDisplayContents.forEach(ensureDisplayContents)

	daysContainer.innerHTML = ''

	if (hasHeaderRow) {
		const headerRow = document.createElement('tr')
		headerRow.classList.add('v-date-picker-month__weekdays')
		headerRow.style.display = 'contents'

		headerCandidates.forEach((cell) => {
			const th = document.createElement('th')
			th.style.display = 'contents'
			th.appendChild(cell)
			headerRow.appendChild(th)
		})

		thead.appendChild(headerRow)
		table.appendChild(thead)
	}

	const bodyCells = hasHeaderRow ? allCells.slice(resolvedColumnCount) : allCells

	for (let index = 0; index < bodyCells.length; index += resolvedColumnCount) {
		const rowCells = bodyCells.slice(index, index + resolvedColumnCount)
		if (rowCells.length === 0) continue

		const row = document.createElement('tr')
		row.classList.add('v-date-picker-month__week')
		row.style.display = 'contents'

		rowCells.forEach((cell) => {
			const td = document.createElement('td')
			td.style.display = 'contents'
			td.appendChild(cell)
			row.appendChild(td)
		})

		tbody.appendChild(row)
	}

	table.appendChild(tbody)
	daysContainer.appendChild(table)
	daysContainer.dataset.syStructured = 'true'
}

const isSelectedCell = (cell: HTMLElement, button: HTMLElement): boolean => (
	cell.classList.contains('v-date-picker-month__day--selected')
	|| cell.classList.contains('v-date-picker-month__day--range-start')
	|| cell.classList.contains('v-date-picker-month__day--range-end')
	|| button.classList.contains('v-btn--active')
	|| button.getAttribute('aria-current') === 'date'
)

const assignGridCellAttributes = (cell: HTMLElement, rowIndex: number, colIndex: number) => {
	const button = cell.querySelector<HTMLElement>(DAY_BUTTON_SELECTOR)
	if (!button) return

	button.setAttribute('role', 'gridcell')
	button.setAttribute('aria-rowindex', String(rowIndex))
	button.setAttribute('aria-colindex', String(colIndex))
	button.setAttribute('aria-selected', isSelectedCell(cell, button) ? 'true' : 'false')
}

const inferColumnCount = (monthEl: HTMLElement, headerCells: HTMLElement[], weekRows: HTMLElement[]): number => {
	if (headerCells.length > 0) return headerCells.length
	const firstWeek = weekRows.find(row => row.querySelector(DAY_CELL_SELECTOR))
	if (firstWeek) {
		const dayCells = Array.from(firstWeek.querySelectorAll<HTMLElement>(DAY_CELL_SELECTOR)).filter(cell => firstWeek.contains(cell))
		if (dayCells.length > 0) return dayCells.length
	}
	const cssValue = monthEl.style.getPropertyValue('--v-date-picker-days-in-week')?.trim()
	const parsed = cssValue ? Number.parseInt(cssValue, 10) : Number.NaN
	if (Number.isFinite(parsed) && parsed > 0) return parsed
	return 7
}

const applyGridSemantics = (pickerEl: HTMLElement) => {
	const monthEls = pickerEl.querySelectorAll<HTMLElement>(GRID_ROOT_SELECTOR)
	if (monthEls.length === 0) return

	monthEls.forEach((monthEl) => {
		ensureWeekdayHeaderInThead(monthEl)
		const headerRow = monthEl.querySelector<HTMLElement>(WEEKDAY_ROW_SELECTOR)
		const headerCells = headerRow
			? Array.from(headerRow.querySelectorAll<HTMLElement>(HEADER_CELL_SELECTOR)).filter(cell => compactText(cell.textContent).length > 0)
			: []
		const weekRows = Array.from(monthEl.querySelectorAll<HTMLElement>(WEEK_ROW_SELECTOR))
		const colCount = inferColumnCount(monthEl, headerCells, weekRows)
		const headerOffset = headerRow ? 1 : 0
		const labelScope = monthEl.closest('.v-date-picker') ?? monthEl

		monthEl.setAttribute('role', 'grid')
		monthEl.setAttribute('aria-readonly', 'true')
		monthEl.setAttribute('aria-label', inferGridLabel(labelScope))
		monthEl.setAttribute('aria-colcount', String(Math.max(colCount, 1)))
		monthEl.setAttribute('aria-rowcount', String(Math.max(weekRows.length + headerOffset, 1)))

		if (headerRow) {
			headerRow.setAttribute('role', 'row')
			headerRow.setAttribute('aria-rowindex', '1')
			headerCells.forEach((cell, index) => {
				cell.setAttribute('role', 'columnheader')
				cell.setAttribute('aria-colindex', String(index + 1))
			})
		}

		weekRows.forEach((row, weekIndex) => {
			const rowIndex = weekIndex + 1 + headerOffset
			row.setAttribute('role', 'row')
			row.setAttribute('aria-rowindex', String(rowIndex))

			const dayCells = Array.from(row.querySelectorAll<HTMLElement>(DAY_CELL_SELECTOR)).filter(cell => row.contains(cell))
			dayCells.forEach((cell, colIndex) => {
				assignGridCellAttributes(cell, rowIndex, colIndex + 1)
			})
		})
	})
}

/**
 * Améliore l'accessibilité du CalendarMode en ajoutant des attributs ARIA et des instructions pour les lecteurs d'écran
 * @returns Des fonctions pour mettre à jour l'accessibilité du CalendarMode et gérer les événements clavier
 */
export function useDatePickerAccessibility() {
	/**
	 * Met à jour les attributs d'accessibilité du CalendarMode
	 * Ajoute des attributs ARIA et des instructions pour les lecteurs d'écran
	 * Corrige également les attributs ARIA invalides
	 */
	const updateAccessibility = async (): Promise<void> => {
		await nextTick()

		const pickerEls = Array.from(document.querySelectorAll<HTMLElement>('.v-date-picker'))
		if (pickerEls.length === 0) return

		pickerEls.forEach((pickerEl) => {
			ensureNavigationButtonLabels(pickerEl)
			applyGridSemantics(pickerEl)
		})
	}

	// Référence pour le MutationObserver (désactivé)
	// const observer: MutationObserver | null = null

	/**
	 * Corrige les attributs ARIA invalides dans le composant
	 * Ici on ne supprime plus globalement aria-expanded/aria-haspopup pour éviter de casser la combobox.
	 */
	const fixAriaAttributes = () => {
		// Désormais no-op pour éviter de retirer des attributs utiles.
	}

	/**
	 * Simule un clic sur l'élément focalisé lorsque la touche Entrée est pressée.
	 * Ne touche pas aux autres touches (espace, etc.).
	 */
	const handleKeyDown = (event: KeyboardEvent) => {
		if (event.key !== 'Enter') return

		event.preventDefault()
		const target = document.activeElement
		if (target instanceof HTMLElement) {
			target.click()
		}
	}

	/**
	 * (Observer désactivé) : on évite de muter globalement les attributs aria du document.
	 */
	const setupMutationObserver = () => {
		// noop
	}

	// Configurer l'observateur au montage du composant
	onMounted(() => {
		// Exécuter une première fois pour nettoyer les attributs initiaux
		fixAriaAttributes()
		// Configurer l'observateur pour les changements futurs
		setupMutationObserver()
	})

	// Nettoyer l'observateur avant de démonter le composant (noop ici)
	onBeforeUnmount(() => {
		/* noop */
	})

	return {
		updateAccessibility,
		handleKeyDown,
		fixAriaAttributes,
	}
}

export default useDatePickerAccessibility
