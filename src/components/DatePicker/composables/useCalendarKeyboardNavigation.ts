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

	const toISO = (date: Date) => dayjs(date).format('YYYY-MM-DD')

	let isListenerAttached = false

	const getBaseDateFromEvent = (event: KeyboardEvent): { date: Date | null, fromDayCell: boolean } => {
		const target = event.target as HTMLElement | null
		const dayWrapper = target?.closest<HTMLElement>('[data-v-date]')
		const iso = dayWrapper?.getAttribute('data-v-date')
		if (!iso) {
			return { date: getCurrentDate(), fromDayCell: false }
		}

		const parsed = dayjs(iso, 'YYYY-MM-DD', true)
		if (!parsed.isValid()) {
			return { date: getCurrentDate(), fromDayCell: false }
		}

		return { date: parsed.toDate(), fromDayCell: true }
	}

	const handleArrowNavigation = (event: KeyboardEvent) => {
		if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
			return
		}

		// Ne pas intercepter les combinaisons de touches de navigation système (Ctrl/Alt/Meta)
		if (event.altKey || event.ctrlKey || event.metaKey) {
			return
		}

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

		nextTick(() => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- mock Axios headers
			const rootEl = (datePickerRef.value as any)?.$el as HTMLElement | undefined
			if (!rootEl) return

			const selector = `[data-v-date="${toISO(nextDate)}"] > [type="button"]`
			const dayButton = rootEl.querySelector<HTMLElement>(selector)

			dayButton?.focus()
		})
	}

	const keydownListener = (event: Event) => {
		const keyboardEvent = event as KeyboardEvent
		const target = keyboardEvent.target as HTMLElement | null

		// Ne pas interférer avec la saisie dans les champs de formulaire ou zones éditables
		if (target) {
			const tagName = target.tagName
			if (tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT' || (target as HTMLElement).isContentEditable) {
				return
			}
		}

		handleArrowNavigation(keyboardEvent)
	}

	const attachListeners = () => {
		if (isListenerAttached) return
		document.addEventListener('keydown', keydownListener as EventListener, true)
		isListenerAttached = true
	}

	const detachListeners = () => {
		if (!isListenerAttached) return
		document.removeEventListener('keydown', keydownListener as EventListener, true)
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
