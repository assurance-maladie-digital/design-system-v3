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

	const getBaseDateFromEvent = (event: KeyboardEvent): Date | null => {
		const target = event.target as HTMLElement | null
		const dayWrapper = target?.closest<HTMLElement>('[data-v-date]')
		const iso = dayWrapper?.getAttribute('data-v-date')
		if (!iso) return getCurrentDate()

		const parsed = dayjs(iso, 'YYYY-MM-DD', true)
		if (!parsed.isValid()) return getCurrentDate()

		return parsed.toDate()
	}

	const handleArrowNavigation = (event: KeyboardEvent) => {
		if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
			return
		}

		const current = getBaseDateFromEvent(event)
		if (!current) return

		event.preventDefault()

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
		handleArrowNavigation(event as KeyboardEvent)
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
