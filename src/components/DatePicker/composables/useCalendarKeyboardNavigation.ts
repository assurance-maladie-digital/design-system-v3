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
}

export const useCalendarKeyboardNavigation = (options: CalendarKeyboardNavigationOptions) => {
	const {
		isDatePickerVisible,
		datePickerRef,
		getCurrentDate,
		setCurrentDate,
	} = options

	const addDays = (date: Date, amount: number) => dayjs(date).add(amount, 'day').toDate()
	const addMonths = (date: Date, amount: number) => dayjs(date).add(amount, 'month').toDate()
	const addYears = (date: Date, amount: number) => dayjs(date).add(amount, 'year').toDate()

	const toISO = (date: Date) => dayjs(date).format('YYYY-MM-DD')

	let isListenerAttached = false

	const focusMonthButton = (button: HTMLButtonElement | undefined | null) => {
		button?.focus({ preventScroll: true })
	}

	const focusYearButton = (button: HTMLButtonElement | undefined | null) => {
		if (!button) return
		button.scrollIntoView({ block: 'nearest', inline: 'nearest' })
		button.focus({ preventScroll: true })
	}

	const handleMonthDialogNavigation = (event: KeyboardEvent): boolean => {
		const targetBtn = (event.target as HTMLElement | null)?.closest<HTMLButtonElement>('.v-date-picker-months button')
		if (!targetBtn) return false

		const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>('.v-date-picker-months button')).filter(btn => !btn.disabled)
		if (buttons.length === 0) return false

		const currentIndex = buttons.indexOf(targetBtn)
		if (currentIndex === -1) return false

		const key = event.key

		// Enter/Space : click manuel sans scroll pour garantir l'activation
		if (key === 'Enter' || key === ' ') {
			event.preventDefault()
			targetBtn.click()
			focusMonthButton(targetBtn)
			return true
		}

		if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(key)) return false

		event.preventDefault()

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
		const targetBtn = (event.target as HTMLElement | null)?.closest<HTMLButtonElement>('.v-date-picker-years button')
		if (!targetBtn) return false

		const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>('.v-date-picker-years button')).filter(btn => !btn.disabled)
		if (buttons.length === 0) return false

		const currentIndex = buttons.indexOf(targetBtn)
		if (currentIndex === -1) return false

		const key = event.key

		if (key === 'Enter' || key === ' ') {
			event.preventDefault()
			targetBtn.click()
			focusYearButton(targetBtn)
			return true
		}

		if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(key)) return false

		event.preventDefault()

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

	const focusDateButton = (date: Date, attempt = 0) => {
		nextTick(() => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- mock Axios headers
			const rootEl = (datePickerRef.value as any)?.$el as HTMLElement | undefined
			if (!rootEl) return

			const iso = toISO(date)

			// Essayer plusieurs sélecteurs pour trouver le bouton du jour
			const selectors = [
				`[data-v-date="${iso}"] > [type="button"]`, // Bouton enfant direct avec data-v-date
				`[data-v-date="${iso}"] button`, // N'importe quel bouton dans l'élément avec data-v-date
				`[data-v-date="${iso}"] .v-btn`, // Bouton Vuetify spécifique avec data-v-date
				`[data-v-date="${iso}"] [role="button"]`, // Élément avec role="button" et data-v-date
				// Sélecteurs Vuetify sans data-v-date
				`.v-date-picker-month__day:has(.v-btn[aria-label*="${date.getDate()}"]) .v-btn`,
				`.v-date-picker-month__day .v-btn[aria-label*="${date.getDate()}"]`,
			]

			let dayButton: HTMLElement | null = null
			for (let i = 0; i < selectors.length; i++) {
				const selector = selectors[i]
				if (selector) {
					const found = rootEl.querySelector(selector) as HTMLElement | null
					if (found) {
						dayButton = found
						// Forcer le focus immédiatement et aussi après un court délai
						dayButton.focus({ preventScroll: true })
						setTimeout(() => {
							dayButton?.focus({ preventScroll: true })
						}, 10)
						return
					}
				}
			}

			// Si aucun sélecteur précis ne fonctionne, chercher par aria-label complet
			const ariaLabelPattern = new RegExp(`\\b${date.getDate()}\\b`)
			const allButtons = rootEl.querySelectorAll<HTMLElement>('.v-date-picker-month__day .v-btn')

			for (let i = 0; i < allButtons.length; i++) {
				const button = allButtons[i]
				if (button) {
					const ariaLabel = button.getAttribute('aria-label')
					if (ariaLabel && ariaLabelPattern.test(ariaLabel)) {
						button.focus({ preventScroll: true })
						return
					}
				}
			}

			// Lorsque le changement de mois re-render la grille, le bouton peut ne pas
			// encore exister : on retente quelques fois pour conserver le focus clavier.
			if (attempt < 3) {
				setTimeout(() => focusDateButton(date, attempt + 1), 10)
			}
		})
	}

	const clickDateButton = (date: Date) => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any -- mock Axios headers
		const rootEl = (datePickerRef.value as any)?.$el as HTMLElement | undefined
		if (!rootEl) return

		const iso = toISO(date)

		// Essayer plusieurs sélecteurs pour trouver le bouton du jour
		const selectors = [
			`[data-v-date="${iso}"] > [type="button"]`, // Bouton enfant direct avec data-v-date
			`[data-v-date="${iso}"] button`, // N'importe quel bouton dans l'élément avec data-v-date
			`[data-v-date="${iso}"] .v-btn`, // Bouton Vuetify spécifique avec data-v-date
			`[data-v-date="${iso}"] [role="button"]`, // Élément avec role="button" et data-v-date
			// Sélecteurs Vuetify sans data-v-date
			`.v-date-picker-month__day:has(.v-btn[aria-label*="${date.getDate()}"]) .v-btn`,
			`.v-date-picker-month__day .v-btn[aria-label*="${date.getDate()}"]`,
		]

		let dayButton: HTMLButtonElement | null = null
		for (const selector of selectors) {
			dayButton = rootEl.querySelector<HTMLButtonElement>(selector)
			if (dayButton) {
				break
			}
		}

		// Si aucun sélecteur précis ne fonctionne, chercher par aria-label complet
		if (!dayButton) {
			const ariaLabelPattern = new RegExp(`\\b${date.getDate()}\\b`)
			const allButtons = rootEl.querySelectorAll<HTMLElement>('.v-date-picker-month__day .v-btn')
			for (const button of allButtons) {
				const ariaLabel = button.getAttribute('aria-label')
				if (ariaLabel && ariaLabelPattern.test(ariaLabel)) {
					dayButton = button as HTMLButtonElement
					break
				}
			}
		}

		dayButton?.click()
		dayButton?.focus()
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

		const { date: current, fromDayCell } = getBaseDateFromEvent(event)

		if (!current) return

		event.preventDefault()

		let nextDate = current
		// Si l'événement ne vient pas d'un jour du calendrier (par ex. après un
		// changement de mois via les contrôles), on utilise la date de base
		// telle quelle pour « entrer » dans le mois (souvent le 1er jour),
		// sans appliquer immédiatement le décalage lié à la flèche. À partir du
		// moment où le focus est sur un jour (fromDayCell = true), les flèches
		// se comportent normalement.
		if (fromDayCell) {
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
		}

		setCurrentDate(nextDate)
		focusDateButton(nextDate)
	}

	const handleHomeEndPageNavigation = (event: KeyboardEvent) => {
		if (!['Home', 'End', 'PageUp', 'PageDown'].includes(event.key)) {
			return
		}

		const { date: current } = getBaseDateFromEvent(event)
		if (!current) return

		// Respecter les combinaisons système (Ctrl/Alt/Meta), mais autoriser Shift pour année
		if (event.altKey || event.ctrlKey || event.metaKey) {
			return
		}

		event.preventDefault()

		let nextDate = current
		if (event.key === 'Home') {
			nextDate = dayjs(current).startOf('month').toDate()
		}
		else if (event.key === 'End') {
			nextDate = dayjs(current).endOf('month').toDate()
		}
		else if (event.key === 'PageUp') {
			nextDate = event.shiftKey ? addYears(current, -1) : addMonths(current, -1)
		}
		else if (event.key === 'PageDown') {
			nextDate = event.shiftKey ? addYears(current, 1) : addMonths(current, 1)
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

		// Enter/Space : empêcher le scroll et déclencher la sélection explicite
		event.preventDefault()
		clickDateButton(current)
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

		// Utiliser un watcher pour attendre que le VDatePicker soit disponible
		const tryAttach = () => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- sorry
			const rootEl = (datePickerRef.value as any)?.$el as HTMLElement | undefined

			// Chercher le conteneur parent avec tabindex="-1" (le focusTrap)
			const containerEl = rootEl?.parentElement?.querySelector('[tabindex="-1"]') as HTMLElement | undefined
				|| rootEl?.closest('[tabindex="-1"]') as HTMLElement | undefined

			// Chercher le VDatePicker lui-même
			const datePickerEl = rootEl?.querySelector('.v-date-picker') || rootEl

			if (containerEl) {
				// Attacher sur le conteneur du focusTrap (plus prioritaire que le document)
				containerEl.addEventListener('keydown', keydownListener as EventListener, true)
				isListenerAttached = true
			}
			else if (datePickerEl) {
				// Attacher sur le VDatePicker directement
				datePickerEl.addEventListener('keydown', keydownListener as EventListener, true)
				isListenerAttached = true
			}
			else {
				// Fallback : attacher sur le document
				document.addEventListener('keydown', keydownListener as EventListener, true)
				isListenerAttached = true
			}
		}

		// Attendre plusieurs ticks pour être sûr que le focusTrap est déjà attaché
		setTimeout(tryAttach, 100)
	}

	const detachListeners = () => {
		if (!isListenerAttached) return
		// eslint-disable-next-line @typescript-eslint/no-explicit-any -- sorry
		const rootEl = (datePickerRef.value as any)?.$el as HTMLElement | undefined

		// Chercher le conteneur parent avec tabindex="-1" (le focusTrap)
		const containerEl = rootEl?.parentElement?.querySelector('[tabindex="-1"]') as HTMLElement | undefined
			|| rootEl?.closest('[tabindex="-1"]') as HTMLElement | undefined

		// Chercher le VDatePicker lui-même
		const datePickerEl = rootEl?.querySelector('.v-date-picker') || rootEl

		if (containerEl) {
			containerEl.removeEventListener('keydown', keydownListener as EventListener, true)
		}
		else if (datePickerEl) {
			datePickerEl.removeEventListener('keydown', keydownListener as EventListener, true)
		}
		else {
			document.removeEventListener('keydown', keydownListener as EventListener, true)
		}

		isListenerAttached = false
	}

	watch(isDatePickerVisible, (visible) => {
		if (visible) {
			nextTick(attachListeners)
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
	}
}
