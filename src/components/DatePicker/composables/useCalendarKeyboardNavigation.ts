import {
	type Ref,
	type ComponentPublicInstance,
	watch,
	nextTick,
	onMounted,
	onBeforeUnmount,
} from 'vue'
import dayjs from 'dayjs'

export interface CalendarKeyboardNavigationOptions {
	isDatePickerVisible: Ref<boolean>
	datePickerRef: Ref<ComponentPublicInstance | null>

	// Renvoie la date actuellement "active" sur le calendrier
	getCurrentDate: () => Date | null

	// Applique la nouvelle date (typiquement via updateSelectedDates)
	setCurrentDate: (date: Date) => void

	// Déclenche la sélection effective de la date courante
	onSelectDate?: (date: Date) => void

	// Renvoie la date sur laquelle placer le focus à l'ouverture (date sélectionnée ou aujourd'hui)
	getInitialFocusDate?: () => Date
}

export const useCalendarKeyboardNavigation = (options: CalendarKeyboardNavigationOptions) => {
	const {
		isDatePickerVisible,
		datePickerRef,
		getCurrentDate,
		setCurrentDate,
		getInitialFocusDate,
		onSelectDate,
	} = options

	const addDays = (date: Date, amount: number) => dayjs(date).add(amount, 'day').toDate()

	const toISO = (date: Date) => dayjs(date).format('YYYY-MM-DD')

	const getStartOfDisplayedWeek = (date: Date) => {
		const mondayBasedOffset = (date.getDay() + 6) % 7
		return addDays(date, -mondayBasedOffset)
	}

	const getEndOfDisplayedWeek = (date: Date) => {
		const startOfWeek = getStartOfDisplayedWeek(date)
		return addDays(startOfWeek, 6)
	}

	let isListenerAttached = false
	let attachTimeoutId: ReturnType<typeof setTimeout> | undefined
	let lastFocusedMonthButton: HTMLElement | null = null
	let lastFocusedYearButton: HTMLElement | null = null

	const MONTH_PROXY_SELECTOR = '[data-sy-date-picker-option="month"]'
	const YEAR_PROXY_SELECTOR = '[data-sy-date-picker-option="year"]'
	const MONTH_BUTTON_SELECTOR = '.v-date-picker-months .v-btn, .v-date-picker-months button'
	const YEAR_BUTTON_SELECTOR = '.v-date-picker-years .v-btn, .v-date-picker-years button'
	const getDialogQueryRoot = (root: HTMLElement | undefined) => root ?? document

	const getMonthItemSelector = (root: HTMLElement | undefined) => (
		getDialogQueryRoot(root).querySelector(MONTH_PROXY_SELECTOR) ? MONTH_PROXY_SELECTOR : MONTH_BUTTON_SELECTOR
	)

	const getYearItemSelector = (root: HTMLElement | undefined) => (
		getDialogQueryRoot(root).querySelector(YEAR_PROXY_SELECTOR) ? YEAR_PROXY_SELECTOR : YEAR_BUTTON_SELECTOR
	)

	const getKeyboardContainer = (rootEl: HTMLElement | undefined) => {
		if (!rootEl) return undefined

		return rootEl.closest<HTMLElement>('[role="dialog"][tabindex="-1"]')
			?? rootEl.parentElement?.closest<HTMLElement>('[role="dialog"][tabindex="-1"]')
			?? rootEl.querySelector<HTMLElement>(':scope > [role="dialog"][tabindex="-1"]')
			?? undefined
	}

	const focusMonthButton = (button: HTMLElement | undefined | null) => {
		if (!button) return

		lastFocusedMonthButton = button
		const rootEl = datePickerRef.value?.$el as HTMLElement | undefined
		const itemSelector = getMonthItemSelector(rootEl)
		const items = getNavigableButtons(itemSelector)
		items.forEach((item) => {
			item.tabIndex = item === button ? 0 : -1
		})
		button.focus({ preventScroll: true })
	}

	const focusYearButton = (button: HTMLElement | undefined | null) => {
		if (!button) return
		lastFocusedYearButton = button
		const rootEl = datePickerRef.value?.$el as HTMLElement | undefined
		const itemSelector = getYearItemSelector(rootEl)
		const items = getNavigableButtons(itemSelector)
		items.forEach((item) => {
			item.tabIndex = item === button ? 0 : -1
		})
		button.scrollIntoView({ block: 'nearest', inline: 'nearest' })
		button.focus({ preventScroll: true })
	}

	const focusDayCell = (cell: HTMLElement | undefined | null) => {
		if (!cell) return

		if (!cell.hasAttribute('tabindex')) {
			cell.setAttribute('tabindex', '-1')
		}

		cell.focus({ preventScroll: true })
	}

	const isActiveTransitionContext = (el: Element) => {
		const windowItem = el.closest('.v-window-item')
		if (!windowItem) return true
		const classes = Array.from(windowItem.classList)
		return !classes.some(c => c.includes('leave-active') || c.includes('leave-to') || c === 'v-window-item--leave')
	}

	const getNavigableButtons = (selector: string): HTMLElement[] => {
		const rootEl = datePickerRef.value?.$el as HTMLElement | undefined
		return Array.from((rootEl ?? document).querySelectorAll<HTMLElement>(selector))
			.filter(btn => !btn.hasAttribute('disabled'))
			.filter(btn => isActiveTransitionContext(btn))
	}

	const getInitialDialogDate = () => getInitialFocusDate ? getInitialFocusDate() : new Date()

	const isActiveDialogItem = (item: HTMLElement) => (
		item.getAttribute('aria-pressed') === 'true'
		|| item.classList.contains('v-btn--active')
		|| item.querySelector('button.v-btn--active') !== null
	)

	const resolveMonthButtonFromState = (buttons: HTMLElement[]) => {
		const activeButton = buttons.find(button => isActiveDialogItem(button))
		if (activeButton) return activeButton

		const targetMonth = getInitialDialogDate().getMonth()
		return buttons[targetMonth] ?? null
	}

	const resolveYearButtonFromState = (buttons: HTMLElement[]) => {
		const activeButton = buttons.find(button => isActiveDialogItem(button))
		if (activeButton) return activeButton

		const targetYear = String(getInitialDialogDate().getFullYear())
		return buttons.find(button =>
			(button.getAttribute('aria-label') ?? button.textContent ?? '').includes(targetYear),
		) ?? null
	}

	const updateLastFocusedDialogButton = (target: EventTarget | null) => {
		const element = target instanceof HTMLElement ? target : null
		if (!element) return

		const rootEl = datePickerRef.value?.$el as HTMLElement | undefined
		const monthButton = element.closest<HTMLElement>(getMonthItemSelector(rootEl))
		if (monthButton) {
			lastFocusedMonthButton = monthButton
			return
		}

		const yearButton = element.closest<HTMLElement>(getYearItemSelector(rootEl))
		if (yearButton) {
			lastFocusedYearButton = yearButton
		}
	}

	const focusinListener = (event: Event) => {
		updateLastFocusedDialogButton(event.target)
	}

	const resolveCurrentDialogButton = (
		buttons: HTMLElement[],
		targetButton: HTMLElement | null,
		lastFocusedButton: HTMLElement | null,
		selector: string,
		fallbackResolver: (buttons: HTMLElement[]) => HTMLElement | null,
	) => {
		if (lastFocusedButton && buttons.includes(lastFocusedButton)) {
			return lastFocusedButton
		}

		const activeElement = typeof document !== 'undefined' && document.activeElement instanceof HTMLElement
			? document.activeElement
			: null
		const activeButton = activeElement?.closest<HTMLElement>(selector) ?? null

		if (activeButton && buttons.includes(activeButton)) {
			return activeButton
		}

		if (targetButton && buttons.includes(targetButton)) {
			return targetButton
		}

		return fallbackResolver(buttons)
	}

	const isDialogViewOpen = (selector: string) => getNavigableButtons(selector).length > 0

	const handleMonthDialogNavigation = (event: KeyboardEvent): boolean => {
		const rootEl = datePickerRef.value?.$el as HTMLElement | undefined
		const itemSelector = getMonthItemSelector(rootEl)
		const targetBtn = (event.target as HTMLElement | null)?.closest<HTMLElement>(itemSelector)
		const buttons = getNavigableButtons(itemSelector)
		if (buttons.length === 0 || !isDialogViewOpen(itemSelector)) return false

		const currentButton = resolveCurrentDialogButton(
			buttons,
			targetBtn ?? null,
			lastFocusedMonthButton,
			itemSelector,
			resolveMonthButtonFromState,
		)
		const currentIndex = currentButton ? buttons.indexOf(currentButton) : -1
		if (currentIndex === -1) return false

		const key = event.key

		// Enter/Space : click manuel sans scroll pour garantir l'activation
		if (key === 'Enter' || key === ' ') {
			event.preventDefault()
			event.stopPropagation()
			const buttonToActivate = targetBtn ?? currentButton
			if (!buttonToActivate) return false
			const targetAction = buttonToActivate.matches(MONTH_PROXY_SELECTOR)
				? buttonToActivate.querySelector<HTMLElement>('button')
				: buttonToActivate
			targetAction?.click()
			focusMonthButton(buttonToActivate)
			return true
		}

		if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(key)) return false

		event.preventDefault()
		event.stopPropagation()

		const firstRowTop = buttons[0]?.offsetTop ?? 0
		const columns = buttons.filter(btn => btn.offsetTop === firstRowTop).length || 3

		const moveIndex = (delta: number) => {
			const nextIndex = Math.min(Math.max(currentIndex + delta, 0), buttons.length - 1)
			focusMonthButton(buttons[nextIndex])
		}

		switch (key) {
			case 'ArrowLeft':
				moveIndex(-1)
				return true
			case 'ArrowRight':
				moveIndex(1)
				return true
			case 'ArrowUp':
				moveIndex(-columns)
				return true
			case 'ArrowDown':
				moveIndex(columns)
				return true
			case 'Home':
				focusMonthButton(buttons[0])
				return true
			case 'End':
				focusMonthButton(buttons[buttons.length - 1])
				return true
		}

		return false
	}

	const handleYearDialogNavigation = (event: KeyboardEvent): boolean => {
		const rootEl = datePickerRef.value?.$el as HTMLElement | undefined
		const itemSelector = getYearItemSelector(rootEl)
		const targetBtn = (event.target as HTMLElement | null)?.closest<HTMLElement>(itemSelector)
		const buttons = getNavigableButtons(itemSelector)
		if (buttons.length === 0 || !isDialogViewOpen(itemSelector)) return false

		const currentButton = resolveCurrentDialogButton(
			buttons,
			targetBtn ?? null,
			lastFocusedYearButton,
			itemSelector,
			resolveYearButtonFromState,
		)
		const currentIndex = currentButton ? buttons.indexOf(currentButton) : -1
		if (currentIndex === -1) return false

		const key = event.key

		if (key === 'Enter' || key === ' ') {
			event.preventDefault()
			event.stopPropagation()
			const buttonToActivate = targetBtn ?? currentButton
			if (!buttonToActivate) return false
			const targetAction = buttonToActivate.matches(YEAR_PROXY_SELECTOR)
				? buttonToActivate.querySelector<HTMLElement>('button')
				: buttonToActivate
			targetAction?.click()
			focusYearButton(buttonToActivate)
			return true
		}

		if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(key)) return false

		event.preventDefault()
		event.stopPropagation()

		const firstRowTop = buttons[0]?.offsetTop ?? 0
		const columns = buttons.filter(btn => btn.offsetTop === firstRowTop).length || 3

		const moveIndex = (delta: number) => {
			const nextIndex = Math.min(Math.max(currentIndex + delta, 0), buttons.length - 1)
			focusYearButton(buttons[nextIndex])
		}

		switch (key) {
			case 'ArrowLeft':
				moveIndex(-1)
				return true
			case 'ArrowRight':
				moveIndex(1)
				return true
			case 'ArrowUp':
				moveIndex(-columns)
				return true
			case 'ArrowDown':
				moveIndex(columns)
				return true
			case 'Home':
				focusYearButton(buttons[0])
				return true
			case 'End':
				focusYearButton(buttons[buttons.length - 1])
				return true
		}

		return false
	}

	const getBaseDateFromEvent = (event: KeyboardEvent): { date: Date | null, fromDayCell: boolean } => {
		const target = event.target as HTMLElement | null
		// Chercher d'abord avec data-v-date, puis avec les classes Vuetify
		const dayWrapper = target?.closest<HTMLElement>('[data-v-date]')
			|| target?.closest<HTMLElement>('.v-date-picker-month__day')

		// Essayer d'abord l'attribut data-v-date
		let iso = dayWrapper?.getAttribute('data-v-date')

		// Si pas d'attribut data-v-date, essayer de récupérer la date depuis les classes Vuetify
		if (!iso && dayWrapper) {
			// Vuetify utilise souvent des classes spécifiques pour identifier les dates
			// On peut essayer de récupérer la date depuis l'élément bouton lui-même
			const button = dayWrapper.querySelector<HTMLElement>('.v-btn')
			if (button) {
				// Vuetify peut stocker la date dans un attribut data ou via aria-label
				iso = button.getAttribute('data-date')
					|| button.getAttribute('aria-label')?.split(' ').pop()
			}
		}

		if (!iso) {
			return { date: getCurrentDate(), fromDayCell: false }
		}

		// Nettoyer le format si nécessaire (enlever le texte si c'est aria-label)
		const cleanIso = iso.replace(/^\D+/, '')
		const parsed = dayjs(cleanIso, 'YYYY-MM-DD', true)
		if (!parsed.isValid()) {
			return { date: getCurrentDate(), fromDayCell: false }
		}

		return { date: parsed.toDate(), fromDayCell: true }
	}

	let latestFocusToken = 0

	const focusDateButton = (date: Date, attempt = 0, token?: number) => {
		if (attempt === 0) {
			latestFocusToken++
			token = latestFocusToken
		}

		// Si un autre focus a été demandé entre-temps, on annule
		if (token !== latestFocusToken) return

		const rootEl = datePickerRef.value?.$el as HTMLElement | undefined
		if (!rootEl) {
			if (attempt < 15) {
				setTimeout(() => focusDateButton(date, attempt + 1, token), attempt === 0 ? 10 : 30)
			}
			return
		}

		const iso = toISO(date)
		const dayNum = date.getDate()

		// Exclure les éléments qui sont dans une fenêtre en cours de disparition
		const isActiveContext = (el: Element) => {
			const windowItem = el.closest('.v-window-item')
			if (!windowItem) return true
			const classes = Array.from(windowItem.classList)
			const isLeaving = classes.some(c => c.includes('leave-active') || c.includes('leave-to') || c === 'v-window-item--leave')
			return !isLeaving
		}

		const candidates: HTMLElement[] = []

		// 1. Chercher par data-v-date
		const dataDateElements = rootEl.querySelectorAll(`[data-v-date="${iso}"]`)
		for (const el of Array.from(dataDateElements)) {
			const cell = el.closest<HTMLElement>('[role="gridcell"]') ?? (el as HTMLElement)
			if (cell && isActiveContext(cell)) candidates.push(cell)
		}

		// 2. Chercher par texte ou aria-label si vide
		if (candidates.length === 0) {
			const allButtons = rootEl.querySelectorAll<HTMLElement>('.v-date-picker-month__day .v-btn')
			for (const btn of Array.from(allButtons)) {
				if (!isActiveContext(btn)) continue
				const text = btn.textContent?.trim() || ''
				const ariaLabel = btn.getAttribute('aria-label') || ''
				if (text === dayNum.toString() || new RegExp(`\\b${dayNum}\\b`).test(ariaLabel)) {
					candidates.push(btn.closest<HTMLElement>('[role="gridcell"]') ?? btn.closest<HTMLElement>('.v-date-picker-month__day') ?? btn)
				}
			}
		}

		// Filtrer ceux qui ne sont pas visibles
		const visibleCandidates = candidates.filter((cell) => {
			// Autoriser les éléments en transition (opacity peut être 0 au tout début)
			const windowItem = cell.closest('.v-window-item')
			const isEntering = windowItem && Array.from(windowItem.classList).some(c => c.includes('enter-active') || c.includes('enter-to'))

			if (!isEntering && cell.offsetParent === null) return false

			const style = window.getComputedStyle(cell)
			return style.display !== 'none' && style.visibility !== 'hidden'
		})

		if (visibleCandidates.length > 0) {
			// Préférer les non-adjacents
			visibleCandidates.sort((a, b) => {
				const aAdj = a.closest('.v-date-picker-month__day--adjacent') ? 1 : 0
				const bAdj = b.closest('.v-date-picker-month__day--adjacent') ? 1 : 0
				return aAdj - bAdj
			})

			const bestCandidate = visibleCandidates[0]
			if (bestCandidate) {
				focusDayCell(bestCandidate)

				// Revérifier le focus après la durée typique d'une transition Vuetify (~350ms)
				// car le DOM peut être re-rendu et l'élément détruit, ou le focus perdu pendant l'animation.
				// On le fait aussi sur la première réussite immédiate, utile lors des passages de mois
				// où le jour adjacent initialement focusé est remplacé par le DOM du mois suivant.
				if (attempt <= 1) {
					setTimeout(() => {
						if (
							token === latestFocusToken
							&& typeof document !== 'undefined'
							&& (document.activeElement !== bestCandidate || !bestCandidate.isConnected)
						) {
							// Forcer un retry silencieux
							focusDateButton(date, 2, token)
						}
					}, 350)
				}
				return
			}
		}

		if (attempt < 15) {
			setTimeout(() => focusDateButton(date, attempt + 1, token), attempt === 0 ? 10 : 30)
		}
	}

	const handleArrowNavigation = (event: KeyboardEvent) => {
		if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
			return
		}

		// Ne pas intercepter les combinaisons de touches de navigation système (Ctrl/Alt/Meta)
		if (event.altKey || event.ctrlKey || event.metaKey) {
			return
		}

		// Laisser les flèches fonctionner nativement dans les contrôles d'entête
		if ((event.target as HTMLElement | null)?.closest('.v-date-picker-controls')) return

		// Prioriser l'état de navigation courant. Le focus DOM peut être en retard d'un tick
		// sur des appuis fléchés successifs, notamment quand Vuetify re-render la grille.
		const { date: targetDate } = getBaseDateFromEvent(event)
		const current = getCurrentDate() ?? targetDate

		// Si toujours aucune date n'est résolue, on abandonne
		if (!current) return

		event.preventDefault()

		// Navigation normale des jours
		let nextDate = current
		switch (event.key) {
			case 'ArrowLeft':
				nextDate = addDays(current, -1)
				break
			case 'ArrowRight':
				nextDate = addDays(current, 1)
				break
			case 'ArrowUp':
				nextDate = addDays(current, -7)
				break
			case 'ArrowDown':
				nextDate = addDays(current, 7)
				break
		}

		// Mettre à jour l'état (ce qui peut déclencher un changement de mois dans Vuetify)
		setCurrentDate(nextDate)

		// Forcer le focus sur le nouveau jour de manière résiliente
		focusDateButton(nextDate)
	}

	const handleHomeEndPageNavigation = (event: KeyboardEvent) => {
		if (!['Home', 'End', 'PageUp', 'PageDown'].includes(event.key)) {
			return
		}

		// Pour la navigation de mois, toujours utiliser la date courante sélectionnée
		// plutôt que de dépendre du DOM qui peut ne pas avoir le focus sur un jour
		const current = getCurrentDate()
		if (!current) return

		// Respecter les combinaisons système (Ctrl/Alt/Meta), mais autoriser Shift pour année
		if (event.altKey || event.ctrlKey || event.metaKey) {
			return
		}

		event.preventDefault()

		let nextDate = current
		if (event.key === 'Home') {
			nextDate = getStartOfDisplayedWeek(current)
		}
		else if (event.key === 'End') {
			nextDate = getEndOfDisplayedWeek(current)
		}
		else if (event.key === 'PageUp') {
			const currentDay = dayjs(current).date()
			const base = event.shiftKey ? dayjs(current).add(-1, 'year') : dayjs(current).add(-1, 'month')
			const clampedDay = Math.min(currentDay, base.daysInMonth())
			nextDate = base.date(clampedDay).toDate()
		}
		else if (event.key === 'PageDown') {
			const currentDay = dayjs(current).date()
			const base = event.shiftKey ? dayjs(current).add(1, 'year') : dayjs(current).add(1, 'month')
			const clampedDay = Math.min(currentDay, base.daysInMonth())
			nextDate = base.date(clampedDay).toDate()
		}

		setCurrentDate(nextDate)
		focusDateButton(nextDate)
	}

	const handleEnterSpaceNavigation = (event: KeyboardEvent) => {
		if (!['Enter', ' '].includes(event.key)) {
			return
		}

		// Gérer manuellement les contrôles d'entête (mois/année et flèches) car le composant natif est surchargé
		const headerButton = (event.target as HTMLElement | null)?.closest<HTMLButtonElement>('.v-date-picker-controls button, .v-date-picker-header button')
		if (headerButton) {
			if (event.key === ' ' || event.key === 'Enter') {
				event.preventDefault()
				headerButton.click()
				// Garder le focus sur le contrôle pour éviter la lecture de toute la grille
				headerButton.focus({ preventScroll: true })
				setTimeout(() => headerButton.focus({ preventScroll: true }), 0)
			}
			return
		}

		const { date: current, fromDayCell } = getBaseDateFromEvent(event)
		if (!current || !fromDayCell) return

		// Enter/Space sur un jour : laisser VDatePicker gérer le clic natif
		// (la sélection + fermeture se font via v-model et le watcher)
		setCurrentDate(current)
		onSelectDate?.(current)
	}

	const keydownListener = (event: Event) => {
		const keyboardEvent = event as KeyboardEvent
		const target = keyboardEvent.target as HTMLElement | null

		// Ne pas interférer avec la saisie dans les champs de formulaire ou zones éditables
		if (target) {
			const tagName = target.tagName
			if (tagName === 'INPUT' || tagName === 'TEXTAREA' || target.isContentEditable) {
				return
			}
		}

		// Ignorer les modificateurs sauf Shift pour PageUp/PageDown (année)
		if (keyboardEvent.ctrlKey || keyboardEvent.altKey || keyboardEvent.metaKey) {
			return
		}

		// Gérer les dialogues mois/année ouverts
		if (handleMonthDialogNavigation(keyboardEvent) || handleYearDialogNavigation(keyboardEvent)) {
			return
		}

		// Gérer la navigation fléchée
		handleArrowNavigation(keyboardEvent)

		// Gérer Home/End/Page navigation
		handleHomeEndPageNavigation(keyboardEvent)

		// Gérer Enter/Espace pour sélectionner
		handleEnterSpaceNavigation(keyboardEvent)
	}

	const attachListeners = () => {
		if (isListenerAttached) return

		const tryAttach = () => {
			const rootEl = datePickerRef.value?.$el as HTMLElement | undefined

			// Le listener doit s'attacher au dialog du DatePicker, pas aux gridcells qui
			// peuvent aussi porter tabindex="-1" pour la navigation assistée.
			const containerEl = getKeyboardContainer(rootEl)

			// Chercher le VDatePicker lui-même
			const datePickerEl = rootEl?.querySelector('.v-date-picker') || rootEl

			if (containerEl) {
				// Attacher sur le conteneur du focusTrap (plus prioritaire que le document)
				containerEl.addEventListener('keydown', keydownListener as EventListener, true)
				containerEl.addEventListener('focusin', focusinListener, true)
				isListenerAttached = true
			}
			else if (datePickerEl) {
				// Attacher sur le VDatePicker directement
				datePickerEl.addEventListener('keydown', keydownListener as EventListener, true)
				datePickerEl.addEventListener('focusin', focusinListener, true)
				isListenerAttached = true
			}
			else {
				// Fallback : attacher sur le document
				document.addEventListener('keydown', keydownListener as EventListener, true)
				document.addEventListener('focusin', focusinListener, true)
				isListenerAttached = true
			}
		}

		// Attacher immédiatement pour que la navigation clavier soit disponible dès l'ouverture.
		// Si le DOM n'est pas encore entièrement prêt, on conserve un retry léger.
		tryAttach()

		if (!isListenerAttached) {
			attachTimeoutId = setTimeout(tryAttach, 50)
		}
	}

	const detachListeners = () => {
		// Annuler une éventuelle attache différée encore en attente.
		if (attachTimeoutId !== undefined) {
			clearTimeout(attachTimeoutId)
			attachTimeoutId = undefined
		}

		if (!isListenerAttached) return
		const rootEl = datePickerRef.value?.$el as HTMLElement | undefined

		const containerEl = getKeyboardContainer(rootEl)

		// Chercher le VDatePicker lui-même
		const datePickerEl = rootEl?.querySelector('.v-date-picker') || rootEl

		if (containerEl) {
			containerEl.removeEventListener('keydown', keydownListener as EventListener, true)
			containerEl.removeEventListener('focusin', focusinListener, true)
		}
		else if (datePickerEl) {
			datePickerEl.removeEventListener('keydown', keydownListener as EventListener, true)
			datePickerEl.removeEventListener('focusin', focusinListener, true)
		}
		else {
			document.removeEventListener('keydown', keydownListener as EventListener, true)
			document.removeEventListener('focusin', focusinListener, true)
		}

		isListenerAttached = false
		lastFocusedMonthButton = null
		lastFocusedYearButton = null
	}

	const focusInitialDay = () => {
		const rootEl = datePickerRef.value?.$el as HTMLElement | undefined
		if (!rootEl) return

		const targetDate = getInitialFocusDate ? getInitialFocusDate() : new Date()
		const iso = toISO(targetDate)
		let dayCell = rootEl.querySelector<HTMLElement>(`[data-v-date="${iso}"][role="gridcell"], [data-v-date="${iso}"]`)
		if (!dayCell) {
			const allDates = Array.from(rootEl.querySelectorAll<HTMLElement>('[data-v-date]'))
			const nonAdjacent = allDates.filter(el => !el.classList.contains('v-date-picker-month__day--adjacent'))
			if (nonAdjacent.length > 0) {
				dayCell = nonAdjacent[0]!
			}
		}

		if (dayCell) {
			focusDayCell(dayCell)
			setTimeout(() => {
				focusDateButton(targetDate)
			}, 0)
			return
		}

		focusDateButton(targetDate)
	}

	watch(isDatePickerVisible, (visible) => {
		if (visible) {
			nextTick(() => {
				attachListeners()
				nextTick(focusInitialDay)
			})
		}
		else {
			detachListeners()
		}
	})

	onMounted(() => {
		if (isDatePickerVisible.value) {
			nextTick(attachListeners)
		}
	})

	onBeforeUnmount(() => {
		detachListeners()
	})

	return {
		attachListeners,
		detachListeners,
		focusInitialDay,
	}
}
