import { nextTick, onBeforeUnmount } from 'vue'
import { locales } from '@/components/DatePicker/locales'
import type { ViewMode } from '@/components/DatePicker/composables/useDatePickerViewMode'

/**
 * Composable pour améliorer l'accessibilité du CalendarMode
 */

const MONTH_CONTROL_SELECTOR = [
	'[data-testid="month-btn"]',
	'.v-date-picker-controls__month-btn',
	'.sy-date-picker-controls__month-btn',
].join(',')

const YEAR_CONTROL_SELECTOR = [
	'[data-testid="year-btn"]',
	'.v-date-picker-controls__mode-btn',
	'.v-date-picker-controls__year-btn',
	'.sy-date-picker-controls__year-btn',
].join(',')

const MONTH_OPTION_PROXY_SELECTOR = '[data-sy-date-picker-option="month"]'
const YEAR_OPTION_PROXY_SELECTOR = '[data-sy-date-picker-option="year"]'
const OPTION_BUTTON_MANAGED_TABINDEX_DATASET = 'optionManagedTabindex'
const OPTION_BUTTON_PREVIOUS_TABINDEX_DATASET = 'optionPreviousTabindex'
const GENERATED_OPTION_PROXY_DATASET = 'syDatePickerGeneratedOptionProxy'

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

export const expandMonthAccessibleName = (value: string | number | null | undefined): string => {
	const normalized = String(value ?? '').toLocaleLowerCase('fr-FR')
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

const getStatusRegionId = (pickerEl: HTMLElement): string => {
	let id = pickerEl.dataset.a11yStatusRegionId
	if (!id) {
		id = `date-picker-status-region-${Math.random().toString(36).slice(2)}`
		pickerEl.dataset.a11yStatusRegionId = id
	}
	return id
}

const observeNavigationLabels = (
	pickerEl: HTMLElement,
	observerRegistry: WeakMap<HTMLElement, MutationObserver>,
	registerCleanup: (cleanup: () => void) => void,
	navigationListeners: WeakMap<HTMLButtonElement, () => void>,
) => {
	if (observerRegistry.has(pickerEl)) return

	const controls = pickerEl.querySelector<HTMLElement>('.v-date-picker-controls')
	if (!controls) return

	const observer = new MutationObserver(() => {
		ensureNavigationButtonLabels(pickerEl, observerRegistry, registerCleanup, navigationListeners)
	})

	observer.observe(controls, {
		childList: true,
		subtree: true,
		characterData: true,
	})

	observerRegistry.set(pickerEl, observer)
	registerCleanup(() => {
		observer.disconnect()
		observerRegistry.delete(pickerEl)
	})
}

const ensureControlsStatusRole = (pickerEl: HTMLElement) => {
	const statusRegionId = getStatusRegionId(pickerEl)
	if (pickerEl.querySelector(`#${statusRegionId}`)) return

	const status = document.createElement('div')
	status.id = statusRegionId
	status.setAttribute('role', 'status')
	status.setAttribute('aria-live', 'polite')
	status.setAttribute('aria-atomic', 'true')
	status.style.position = 'absolute'
	status.style.left = '-10000px'
	status.style.width = '1px'
	status.style.height = '1px'
	status.style.overflow = 'hidden'
	status.style.clip = 'rect(0, 0, 0, 0)'
	status.style.whiteSpace = 'nowrap'
	status.style.border = '0'
	pickerEl.appendChild(status)
}

const announceNavigation = (pickerEl: HTMLElement, direction: 'previous' | 'next') => {
	const statusRegionId = getStatusRegionId(pickerEl)
	const region = pickerEl.querySelector<HTMLElement>(`#${statusRegionId}`)
	if (!region) return

	const announcement = direction === 'previous' ? locales.previousMonth : locales.nextMonth

	region.textContent = ''
	nextTick(() => {
		region.textContent = announcement
	})
}

const ensureNavigationButtonLabels = (
	pickerEl: HTMLElement,
	observerRegistry: WeakMap<HTMLElement, MutationObserver>,
	registerCleanup: (cleanup: () => void) => void,
	navigationListeners: WeakMap<HTMLButtonElement, () => void>,
) => {
	observeNavigationLabels(pickerEl, observerRegistry, registerCleanup, navigationListeners)

	const prevButton = pickerEl.querySelector<HTMLButtonElement>(PREV_MONTH_BUTTON_SELECTOR)
	const nextButton = pickerEl.querySelector<HTMLButtonElement>(NEXT_MONTH_BUTTON_SELECTOR)

	const setupButton = (button: HTMLButtonElement | null, direction: 'previous' | 'next') => {
		if (!button) return

		const label = direction === 'previous' ? locales.previousMonth : locales.nextMonth

		button.setAttribute('aria-label', label)
		button.setAttribute('title', label)

		if (!navigationListeners.has(button)) {
			const handler = () => {
				if (document.activeElement !== button) return

				const directionKey = direction
				nextTick(() => {
					setTimeout(() => {
						const selector = directionKey === 'previous' ? PREV_MONTH_BUTTON_SELECTOR : NEXT_MONTH_BUTTON_SELECTOR
						const newButton = pickerEl.querySelector<HTMLElement>(selector)
						newButton?.focus({ preventScroll: true })

						announceNavigation(pickerEl, direction)
					}, 0)
				})
			}
			navigationListeners.set(button, handler)
			button.addEventListener('click', handler)
			registerCleanup(() => {
				button.removeEventListener('click', handler)
				navigationListeners.delete(button)
			})
		}
	}

	setupButton(prevButton, 'previous')
	setupButton(nextButton, 'next')
}

const ensureMonthAndYearSelectorLabels = (
	pickerEl: HTMLElement,
	registerCleanup: (cleanup: () => void) => void,
	selectionListeners: WeakMap<HTMLButtonElement, () => void>,
) => {
	const announceSelection = (announcement: string) => {
		const statusRegionId = getStatusRegionId(pickerEl)
		const region = pickerEl.querySelector<HTMLElement>(`#${statusRegionId}`)
		if (!region) return

		region.textContent = ''
		nextTick(() => {
			region.textContent = announcement
		})
	}

	const monthButtons = pickerEl.querySelectorAll<HTMLButtonElement>('.v-date-picker-months button')

	monthButtons.forEach((button) => {
		const text = compactText(button.textContent)
		if (!text) return

		const monthLabel = expandMonthAccessibleName(text)
		const ariaLabel = locales.selectMonthWithYear(monthLabel)

		button.setAttribute('aria-label', ariaLabel)
		button.setAttribute('title', ariaLabel)
		button.setAttribute('aria-pressed', String(button.classList.contains('v-btn--active')))

		if (!selectionListeners.has(button)) {
			const handler = () => {
				announceSelection(locales.monthDescription(monthLabel))
			}
			selectionListeners.set(button, handler)
			button.addEventListener('click', handler)
			registerCleanup(() => {
				button.removeEventListener('click', handler)
				selectionListeners.delete(button)
			})
		}
	})

	const yearButtons = pickerEl.querySelectorAll<HTMLButtonElement>('.v-date-picker-years button')

	yearButtons.forEach((button) => {
		const text = compactText(button.textContent)
		if (!text) return

		const ariaLabel = locales.selectYear(text)

		button.setAttribute('aria-label', ariaLabel)
		button.setAttribute('title', ariaLabel)
		button.setAttribute('aria-pressed', String(button.classList.contains('v-btn--active')))

		if (!selectionListeners.has(button)) {
			const handler = () => {
				announceSelection(locales.yearDescription(text))
			}
			selectionListeners.set(button, handler)
			button.addEventListener('click', handler)
			registerCleanup(() => {
				button.removeEventListener('click', handler)
				selectionListeners.delete(button)
			})
		}
	})
}

const ensureMonthAndYearControlExpanded = (pickerEl: HTMLElement, viewMode: ViewMode) => {
	const monthControl = pickerEl.querySelector<HTMLElement>(MONTH_CONTROL_SELECTOR)
	const yearControl = pickerEl.querySelector<HTMLElement>(YEAR_CONTROL_SELECTOR)

	if (monthControl) {
		monthControl.setAttribute('aria-expanded', String(viewMode === 'months'))
	}

	if (yearControl) {
		yearControl.setAttribute('aria-expanded', String(viewMode === 'year'))
	}
}

const ensureMonthAndYearLabelAnnouncer = (
	pickerEl: HTMLElement,
	registerCleanup: (cleanup: () => void) => void,
) => {
	const controls = pickerEl.querySelector<HTMLElement>('.v-date-picker-controls')
	if (!controls) return

	const monthControl = pickerEl.querySelector<HTMLElement>(MONTH_CONTROL_SELECTOR)
	const yearControl = pickerEl.querySelector<HTMLElement>(YEAR_CONTROL_SELECTOR)

	// Retirer aria-live des contrôles eux-mêmes pour éviter les annonces parasites
	monthControl?.removeAttribute('aria-live')
	monthControl?.removeAttribute('aria-atomic')
	yearControl?.removeAttribute('aria-live')
	yearControl?.removeAttribute('aria-atomic')

	// Zone live dédiée, hors du nœud observé pour éviter les boucles
	const regionId = `${getStatusRegionId(pickerEl)}-month-year-label`
	let region = pickerEl.querySelector<HTMLElement>(`#${regionId}`)
	if (!region) {
		region = document.createElement('div')
		region.id = regionId
		region.setAttribute('role', 'status')
		region.setAttribute('aria-live', 'polite')
		region.setAttribute('aria-atomic', 'true')
		region.style.position = 'absolute'
		region.style.left = '-10000px'
		region.style.width = '1px'
		region.style.height = '1px'
		region.style.overflow = 'hidden'
		region.style.clip = 'rect(0, 0, 0, 0)'
		region.style.whiteSpace = 'nowrap'
		region.style.border = '0'
		pickerEl.appendChild(region)
	}

	let timeoutId: ReturnType<typeof setTimeout> | undefined
	let lastAnnouncement = [
		monthControl ? compactText(monthControl.textContent) : '',
		yearControl ? compactText(yearControl.textContent) : '',
	].filter(Boolean).join(' ')

	const announceLabel = () => {
		const monthText = monthControl ? compactText(monthControl.textContent) : ''
		const yearText = yearControl ? compactText(yearControl.textContent) : ''
		const announcement = [monthText, yearText].filter(Boolean).join(' ')
		if (!announcement || announcement === lastAnnouncement) return

		lastAnnouncement = announcement

		region.textContent = ''
		nextTick(() => {
			region.textContent = announcement
		})
	}

	const observer = new MutationObserver(() => {
		clearTimeout(timeoutId)
		timeoutId = setTimeout(announceLabel, 100)
	})

	observer.observe(controls, {
		childList: true,
		subtree: true,
		characterData: true,
	})

	registerCleanup(() => {
		observer.disconnect()
		clearTimeout(timeoutId)
	})
}

const observeGridSemantics = (
	pickerEl: HTMLElement,
	registerCleanup: (cleanup: () => void) => void,
) => {
	let isApplying = false
	let scheduled = false

	const needsGridSemantics = () => {
		const monthEls = pickerEl.querySelectorAll<HTMLElement>('.v-date-picker-month')

		return Array.from(monthEls).some((monthEl) => {
			const daysContainer = monthEl.querySelector<HTMLElement>('.v-date-picker-month__days')
			if (!daysContainer) return false

			if (monthEl.getAttribute('role') !== 'grid') return true
			if (daysContainer.querySelector('[data-v-date]:not([role="gridcell"])')) return true
			if (daysContainer.querySelector('.v-date-picker-month__weekday:not([role="columnheader"])')) return true

			return false
		})
	}

	const observer = new MutationObserver(() => {
		if (isApplying || scheduled || !needsGridSemantics()) return

		scheduled = true
		setTimeout(() => {
			scheduled = false
			isApplying = true
			try {
				applyGridSemantics(pickerEl)
			}
			finally {
				isApplying = false
			}
		})
	})

	observer.observe(pickerEl, {
		childList: true,
		subtree: true,
		attributes: true,
		attributeFilter: ['role'],
	})

	registerCleanup(() => {
		observer.disconnect()
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

const cleanupGridSemanticsForSelector = (container: HTMLElement) => {
	Array.from(container.children).forEach((child) => {
		if (
			child instanceof HTMLElement
			&& child.getAttribute('role') === 'row'
			&& child.style.display === 'contents'
		) {
			while (child.firstChild) {
				container.appendChild(child.firstChild)
			}
			child.remove()
		}
	})
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

	daysContainer.querySelectorAll<HTMLButtonElement>('.v-date-picker-month__day button').forEach((button) => {
		if (button.dataset.gridcellManagedTabindex === 'true') {
			button.removeAttribute('tabindex')
			delete button.dataset.gridcellManagedTabindex
		}
	})
}

const cleanupOptionProxies = (container: HTMLElement) => {
	cleanupGridSemanticsForSelector(container)

	Array.from(container.querySelectorAll<HTMLElement>(MONTH_OPTION_PROXY_SELECTOR))
		.concat(Array.from(container.querySelectorAll<HTMLElement>(YEAR_OPTION_PROXY_SELECTOR)))
		.forEach((proxy) => {
			const button = getOptionButton(proxy)
			if (button) {
				restoreManagedButtonTabindex(button)
			}

			proxy.onclick = null
			proxy.onkeydown = null
			proxy.onfocus = null
			proxy.removeAttribute('role')
			proxy.removeAttribute('aria-label')
			proxy.removeAttribute('title')
			proxy.removeAttribute('aria-pressed')
			proxy.removeAttribute('aria-selected')
			proxy.removeAttribute('tabindex')

			if (proxy.dataset[GENERATED_OPTION_PROXY_DATASET] !== 'true') {
				delete proxy.dataset.syDatePickerOption
				return
			}

			const parent = proxy.parentElement
			if (!parent) return

			while (proxy.firstChild) {
				parent.insertBefore(proxy.firstChild, proxy)
			}

			delete proxy.dataset[GENERATED_OPTION_PROXY_DATASET]
			proxy.remove()
		})
}

const updateProxyActivation = (container: HTMLElement, activeProxy: HTMLElement) => {
	const proxies = Array.from(container.querySelectorAll<HTMLElement>(MONTH_OPTION_PROXY_SELECTOR))
		.concat(Array.from(container.querySelectorAll<HTMLElement>(YEAR_OPTION_PROXY_SELECTOR)))

	proxies.forEach((proxy) => {
		proxy.tabIndex = proxy === activeProxy ? 0 : -1
		proxy.setAttribute('aria-selected', String(proxy === activeProxy))
	})
}

const getOptionButton = (host: HTMLElement): HTMLButtonElement | null => {
	if (host instanceof HTMLButtonElement) return host

	return Array.from(host.children).find(
		(child): child is HTMLButtonElement => child instanceof HTMLButtonElement,
	) ?? null
}

const isOptionActive = (host: HTMLElement, button: HTMLButtonElement | null) => (
	host.getAttribute('aria-pressed') === 'true'
	|| host.classList.contains('v-btn--active')
	|| button?.classList.contains('v-btn--active') === true
	|| button?.getAttribute('aria-pressed') === 'true'
)

const setManagedButtonTabindex = (button: HTMLButtonElement) => {
	if (button.dataset[OPTION_BUTTON_MANAGED_TABINDEX_DATASET] === 'true') return

	const previousTabindex = button.getAttribute('tabindex')
	button.dataset[OPTION_BUTTON_PREVIOUS_TABINDEX_DATASET] = previousTabindex ?? ''
	button.setAttribute('tabindex', '-1')
	button.dataset[OPTION_BUTTON_MANAGED_TABINDEX_DATASET] = 'true'
}

const restoreManagedButtonTabindex = (button: HTMLButtonElement) => {
	if (button.dataset[OPTION_BUTTON_MANAGED_TABINDEX_DATASET] !== 'true') return

	const previousTabindex = button.dataset[OPTION_BUTTON_PREVIOUS_TABINDEX_DATASET] ?? ''
	if (previousTabindex) {
		button.setAttribute('tabindex', previousTabindex)
	}
	else {
		button.removeAttribute('tabindex')
	}

	delete button.dataset[OPTION_BUTTON_MANAGED_TABINDEX_DATASET]
	delete button.dataset[OPTION_BUTTON_PREVIOUS_TABINDEX_DATASET]
}

const ensureOptionProxies = (
	container: HTMLElement,
	kind: 'month' | 'year',
	getDefaultActiveIndex: (buttons: HTMLButtonElement[]) => number,
) => {
	const content = container.querySelector<HTMLElement>(`.v-date-picker-${kind}s__content`) ?? container
	const optionHosts = Array.from(content.children).flatMap((child) => {
		if (!(child instanceof HTMLElement)) return []

		if (child instanceof HTMLButtonElement) {
			const proxy = document.createElement('div')
			proxy.dataset.syDatePickerOption = kind
			proxy.dataset[GENERATED_OPTION_PROXY_DATASET] = 'true'
			proxy.className = `sy-date-picker-option-proxy sy-date-picker-option-proxy--${kind}`
			child.parentNode?.insertBefore(proxy, child)
			proxy.appendChild(child)
			return [{ host: proxy, button: child }]
		}

		const button = getOptionButton(child)
		if (!button) return []

		return [{ host: child, button }]
	})
	if (optionHosts.length === 0) return

	const directButtons = optionHosts.map(({ button }) => button)

	const activeIndex = (() => {
		const activeButtonIndex = optionHosts.findIndex(({ host, button }) => isOptionActive(host, button))
		if (activeButtonIndex !== -1) return activeButtonIndex

		const fallbackIndex = getDefaultActiveIndex(directButtons)
		return fallbackIndex >= 0 ? fallbackIndex : 0
	})()

	optionHosts.forEach(({ host, button }, index) => {
		const label = button.getAttribute('aria-label') ?? compactText(button.textContent)
		host.dataset.syDatePickerOption = kind
		host.setAttribute('role', 'gridcell')
		host.setAttribute('aria-label', label)
		host.setAttribute('title', label)
		host.setAttribute('aria-pressed', String(isOptionActive(host, button)))
		host.setAttribute('aria-selected', String(index === activeIndex))
		host.tabIndex = index === activeIndex ? 0 : -1
		setManagedButtonTabindex(button)

		host.onclick = (event: MouseEvent) => {
			if (event.target instanceof Node && button.contains(event.target)) {
				updateProxyActivation(container, host)
				host.focus({ preventScroll: true })
				return
			}

			button.click()
			updateProxyActivation(container, host)
			host.focus({ preventScroll: true })
		}

		host.onkeydown = (event: KeyboardEvent) => {
			if (event.key !== 'Enter' && event.key !== ' ') return

			event.preventDefault()
			button.click()
			updateProxyActivation(container, host)
			host.focus({ preventScroll: true })
		}

		host.onfocus = () => {
			updateProxyActivation(container, host)
		}
	})

	container.setAttribute('role', 'grid')
	container.setAttribute('aria-label', kind === 'month' ? locales.selectMonth() : locales.selectYear())
	container.removeAttribute('aria-readonly')
	container.removeAttribute('aria-rowcount')
	container.removeAttribute('aria-colcount')

	cleanupGridSemanticsForSelector(content)

	const hosts = Array.from(content.querySelectorAll<HTMLElement>(`[data-sy-date-picker-option="${kind}"]`))
	const firstRowTop = hosts[0]?.offsetTop ?? 0
	const columns = hosts.filter(host => host.offsetTop === firstRowTop).length || 3

	for (let i = 0; i < hosts.length; i += columns) {
		const row = createAriaRow(`v-date-picker-${kind}s__row`)
		hosts.slice(i, i + columns).forEach((host) => {
			row.appendChild(host)
		})
		content.appendChild(row)
	}
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

		cleanupGridSemanticsForMonth(daysContainer)

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
				const isSelected = cell.classList.contains('v-date-picker-month__day--selected')
					|| button.classList.contains('v-btn--active')
				if (isSelected) {
					cell.setAttribute('aria-selected', 'true')
				}
				else {
					cell.removeAttribute('aria-selected')
				}

				button.removeAttribute('role')
				button.removeAttribute('aria-rowindex')
				button.removeAttribute('aria-colindex')
				button.removeAttribute('aria-selected')
				button.setAttribute('tabindex', '-1')
				button.dataset.gridcellManagedTabindex = 'true'
				row.appendChild(cell)
			})
			daysContainer.appendChild(row)
		}
	})

	pickerEl.querySelectorAll<HTMLElement>('.v-date-picker-months').forEach((monthsContainer) => {
		ensureOptionProxies(
			monthsContainer,
			'month',
			buttons => buttons.findIndex(button => button.classList.contains('v-btn--active')),
		)
	})

	pickerEl.querySelectorAll<HTMLElement>('.v-date-picker-years').forEach((yearsContainer) => {
		ensureOptionProxies(
			yearsContainer,
			'year',
			buttons => buttons.findIndex(button => button.classList.contains('v-btn--active')),
		)
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
		pickerEl.querySelectorAll<HTMLElement>('.v-date-picker-months, .v-date-picker-years').forEach((container) => {
			cleanupOptionProxies(container)
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
	const updateAccessibility = async (root: ParentNode = document, viewMode?: ViewMode): Promise<void> => {
		await nextTick()

		const pickerEls = Array.from(root.querySelectorAll<HTMLElement>('.v-date-picker'))

		if (root instanceof HTMLElement && root.matches('.v-date-picker')) {
			pickerEls.unshift(root)
		}

		cleanupLastRun?.()

		const observerRegistry = new WeakMap<HTMLElement, MutationObserver>()
		const navigationListeners = new WeakMap<HTMLButtonElement, () => void>()
		const selectionListeners = new WeakMap<HTMLButtonElement, () => void>()
		const pickerCleanups = new Map<HTMLElement, Array<() => void>>()

		pickerEls.forEach((pickerEl) => {
			const cleanups: Array<() => void> = []
			pickerCleanups.set(pickerEl, cleanups)
			const registerCleanup = (cleanup: () => void) => cleanups.push(cleanup)

			ensureControlsStatusRole(pickerEl)
			ensureNavigationButtonLabels(pickerEl, observerRegistry, registerCleanup, navigationListeners)
			ensureMonthAndYearSelectorLabels(pickerEl, registerCleanup, selectionListeners)
			ensureMonthAndYearLabelAnnouncer(pickerEl, registerCleanup)
			if (viewMode !== undefined) {
				ensureMonthAndYearControlExpanded(pickerEl, viewMode)
			}
			applyGridSemantics(pickerEl)
			observeGridSemantics(pickerEl, registerCleanup)
		})

		cleanupLastRun = () => {
			pickerCleanups.forEach((cleanups) => {
				cleanups.forEach(cleanup => cleanup())
			})
			pickerCleanups.clear()
		}
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

	let cleanupLastRun: (() => void) | undefined

	onBeforeUnmount(() => {
		cleanupLastRun?.()
	})

	return {
		updateAccessibility,
		cleanupGridSemantics,
		handleKeyDown,
	}
}

export default useDatePickerAccessibility
