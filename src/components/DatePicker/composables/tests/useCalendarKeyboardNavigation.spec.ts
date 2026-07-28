/* eslint-disable vue/one-component-per-file */
import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import { ref, nextTick, defineComponent, type ComponentPublicInstance } from 'vue'
import { useCalendarKeyboardNavigation } from '../useCalendarKeyboardNavigation'

// Vue Test Util fournit une instance active pour onMounted / onBeforeUnmount

describe('useCalendarKeyboardNavigation', () => {
	it('attaches and detaches keydown listener based on visibility', async () => {
		vi.useFakeTimers()
		const isDatePickerVisible = ref(false)
		const datePickerRef = ref<ComponentPublicInstance | null>(null)
		const getCurrentDate = vi.fn(() => null)
		const setCurrentDate = vi.fn()

		const addEventListenerSpy = vi.spyOn(document, 'addEventListener')
		const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')

		const TestComponent = defineComponent({
			setup() {
				useCalendarKeyboardNavigation({
					isDatePickerVisible,
					datePickerRef,
					getCurrentDate,
					setCurrentDate,
				})
				return () => null
			},
		})

		mount(TestComponent)

		// When the date picker becomes visible, a keydown listener should be attached
		isDatePickerVisible.value = true
		await nextTick() // watcher triggers and calls nextTick(attachListeners)
		await nextTick() // attachListeners runs and sets setTimeout
		vi.advanceTimersByTime(150) // Flush setTimeout inside tryAttach
		expect(addEventListenerSpy).toHaveBeenCalled()

		// When it becomes hidden, the listener should be detached
		isDatePickerVisible.value = false
		await nextTick() // watcher triggers and calls detachListeners
		expect(removeEventListenerSpy).toHaveBeenCalled()

		addEventListenerSpy.mockRestore()
		removeEventListenerSpy.mockRestore()
		vi.useRealTimers()
	})

	it('navigates with arrows correctly, setting next day and forcing focus', async () => {
		vi.useFakeTimers()
		const isDatePickerVisible = ref(true)
		const rootEl = document.createElement('div')

		const datePickerRef = ref<ComponentPublicInstance | null>({ $el: rootEl } as unknown as ComponentPublicInstance)
		const getCurrentDate = vi.fn(() => new Date(2023, 0, 10))
		const setCurrentDate = vi.fn()

		let savedListener: ((e: KeyboardEvent) => void) | null = null

		const addEventListenerSpy = vi.spyOn(document, 'addEventListener').mockImplementation((type, listener) => {
			if (type === 'keydown') {
				savedListener = listener as ((e: KeyboardEvent) => void)
			}
		})

		const TestComponent = defineComponent({
			setup() {
				const { attachListeners } = useCalendarKeyboardNavigation({
					isDatePickerVisible,
					datePickerRef,
					getCurrentDate,
					setCurrentDate,
				})

				// Assurer qu'on ne trouve aucun des deux autres sélecteurs pour retomber sur document.addEventListener
				datePickerRef.value = null

				attachListeners()
				vi.advanceTimersByTime(150) // Flush setTimeout inside tryAttach
				return () => null
			},
		})

		mount(TestComponent)
		expect(savedListener).toBeTruthy()

		// ArrowRight: 10 Jan -> 11 Jan
		const rightEvent = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })
		const currentCell = document.createElement('div')
		currentCell.setAttribute('data-v-date', '2023-01-10')
		const currentButton = document.createElement('button')
		currentButton.type = 'button'
		currentCell.appendChild(currentButton)
		Object.defineProperty(rightEvent, 'target', { value: currentButton })

		if (savedListener) (savedListener as (e: KeyboardEvent) => void)(rightEvent)

		expect(setCurrentDate).toHaveBeenCalled()
		const nextDate = setCurrentDate.mock.calls[0]?.[0] as Date | undefined
		expect(nextDate?.getDate()).toBe(11)

		// ArrowLeft: 10 Jan -> 9 Jan
		setCurrentDate.mockClear()
		const leftEvent = new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true })
		Object.defineProperty(leftEvent, 'target', { value: currentButton })
		if (savedListener) (savedListener as (e: KeyboardEvent) => void)(leftEvent)
		const prevDate = setCurrentDate.mock.calls[0]?.[0] as Date | undefined
		expect(prevDate?.getDate()).toBe(9)

		// ArrowUp: 10 Jan -> 3 Jan
		setCurrentDate.mockClear()
		const upEvent = new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true })
		Object.defineProperty(upEvent, 'target', { value: currentButton })
		if (savedListener) (savedListener as (e: KeyboardEvent) => void)(upEvent)
		const upDate = setCurrentDate.mock.calls[0]?.[0] as Date | undefined
		expect(upDate?.getDate()).toBe(3)

		// ArrowDown: 10 Jan -> 17 Jan
		setCurrentDate.mockClear()
		const downEvent = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true })
		Object.defineProperty(downEvent, 'target', { value: currentButton })
		if (savedListener) (savedListener as (e: KeyboardEvent) => void)(downEvent)
		const downDate = setCurrentDate.mock.calls[0]?.[0] as Date | undefined
		expect(downDate?.getDate()).toBe(17)

		addEventListenerSpy.mockRestore()
		vi.useRealTimers()
	})

	it('preserves day-of-month on PageUp/PageDown and clamps when needed', () => {
		vi.useFakeTimers()
		const isDatePickerVisible = ref(true)
		// Base: 31 March 2023
		const getCurrentDate = vi.fn(() => new Date(2023, 2, 31))
		const setCurrentDate = vi.fn()

		let savedListener: ((e: KeyboardEvent) => void) | null = null
		const addEventListenerSpy = vi.spyOn(document, 'addEventListener').mockImplementation((type, listener) => {
			if (type === 'keydown') savedListener = listener as (e: KeyboardEvent) => void
		})

		let attachListeners!: () => void
		const TestComponent = defineComponent({
			setup() {
				const result = useCalendarKeyboardNavigation({
					isDatePickerVisible,
					datePickerRef: ref(null),
					getCurrentDate,
					setCurrentDate,
				})
				attachListeners = result.attachListeners
				return () => null
			},
		})

		mount(TestComponent)
		attachListeners()
		vi.advanceTimersByTime(150)

		const fireKey = (key: string, shiftKey = false) => {
			setCurrentDate.mockClear()
			const event = new KeyboardEvent('keydown', { key, shiftKey, bubbles: true })
			Object.defineProperty(event, 'target', { value: document.createElement('div') })
			savedListener!(event)
			return setCurrentDate.mock.calls[0]?.[0] as Date | undefined
		}

		// PageUp: 31 Mar -> 28 Feb 2023 (clamped)
		const up = fireKey('PageUp')
		expect(up?.getFullYear()).toBe(2023)
		expect(up?.getMonth()).toBe(1) // Feb
		expect(up?.getDate()).toBe(28)

		// PageDown: 31 Mar -> 30 Apr 2023 (clamped)
		const down = fireKey('PageDown')
		expect(down?.getFullYear()).toBe(2023)
		expect(down?.getMonth()).toBe(3) // Apr
		expect(down?.getDate()).toBe(30)

		addEventListenerSpy.mockRestore()
		vi.useRealTimers()
	})

	it('falls back to getCurrentDate when event target is not a day cell', () => {
		vi.useFakeTimers()
		const isDatePickerVisible = ref(true)
		const rootEl = document.createElement('div')
		const datePickerRef = ref<ComponentPublicInstance | null>({ $el: rootEl } as unknown as ComponentPublicInstance)
		const baseDate = new Date(2023, 0, 10)
		const getCurrentDate = vi.fn(() => baseDate)
		const setCurrentDate = vi.fn()

		let savedListener: ((e: KeyboardEvent) => void) | null = null

		const addEventListenerSpy = vi.spyOn(document, 'addEventListener').mockImplementation((type, listener) => {
			if (type === 'keydown') {
				savedListener = listener as ((e: KeyboardEvent) => void)
			}
		})

		let attachListeners!: () => void
		const TestComponent = defineComponent({
			setup() {
				const result = useCalendarKeyboardNavigation({
					isDatePickerVisible,
					datePickerRef,
					getCurrentDate,
					setCurrentDate,
				})

				datePickerRef.value = null

				attachListeners = result.attachListeners
				return () => null
			},
		})

		mount(TestComponent)

		// Le setTimeout(..., 100) est appelé dans attachListeners, il faut l'avancer
		attachListeners()
		vi.advanceTimersByTime(150)

		expect(addEventListenerSpy).toHaveBeenCalled()
		expect(savedListener).toBeTruthy()

		const preventDefault = vi.fn()
		const event = new KeyboardEvent('keydown', {
			key: 'ArrowRight',
			altKey: false,
			ctrlKey: false,
			metaKey: false,
		})
		Object.defineProperty(event, 'preventDefault', { value: preventDefault })
		Object.defineProperty(event, 'target', { value: document.createElement('button') })

		savedListener!(event)

		expect(preventDefault).toHaveBeenCalled()
		expect(setCurrentDate).toHaveBeenCalledTimes(1)

		// When using ArrowRight from baseDate (10 Jan), it should compute 11 Jan
		const nextDate = setCurrentDate.mock.calls[0]?.[0] as Date | undefined
		expect(nextDate?.getDate()).toBe(11)

		addEventListenerSpy.mockRestore()
		vi.useRealTimers()
	})

	it('does not react to non-arrow keys', () => {
		vi.useFakeTimers()
		const isDatePickerVisible = ref(true)
		const rootEl = document.createElement('div')
		const datePickerRef = ref<ComponentPublicInstance | null>({ $el: rootEl } as unknown as ComponentPublicInstance)
		const getCurrentDate = vi.fn(() => new Date(2023, 0, 10))
		const setCurrentDate = vi.fn()

		let savedListener: ((e: KeyboardEvent) => void) | null = null

		const addEventListenerSpy = vi.spyOn(document, 'addEventListener').mockImplementation((type, listener) => {
			if (type === 'keydown') {
				savedListener = listener as ((e: KeyboardEvent) => void)
			}
		})

		let attachListeners!: () => void
		const TestComponent = defineComponent({
			setup() {
				const result = useCalendarKeyboardNavigation({
					isDatePickerVisible,
					datePickerRef,
					getCurrentDate,
					setCurrentDate,
				})

				datePickerRef.value = null

				attachListeners = result.attachListeners
				return () => null
			},
		})

		mount(TestComponent)

		attachListeners()
		vi.advanceTimersByTime(150) // Flush setTimeout inside tryAttach
		expect(savedListener).toBeTruthy()

		const preventDefault = vi.fn()
		const event = new KeyboardEvent('keydown', {
			key: 'A',
			altKey: false,
			ctrlKey: false,
			metaKey: false,
		})
		Object.defineProperty(event, 'preventDefault', { value: preventDefault })
		Object.defineProperty(event, 'target', { value: document.createElement('div') })

		savedListener!(event)

		expect(setCurrentDate).not.toHaveBeenCalled()
		expect(preventDefault).not.toHaveBeenCalled()

		addEventListenerSpy.mockRestore()
		vi.useRealTimers()
	})

	it('ignores arrow keys when modifier keys are pressed', () => {
		vi.useFakeTimers()
		const isDatePickerVisible = ref(true)
		const rootEl = document.createElement('div')
		const datePickerRef = ref<ComponentPublicInstance | null>({ $el: rootEl } as unknown as ComponentPublicInstance)
		const getCurrentDate = vi.fn(() => new Date(2023, 0, 10))
		const setCurrentDate = vi.fn()

		let savedListener: ((e: KeyboardEvent) => void) | null = null

		const addEventListenerSpy = vi.spyOn(document, 'addEventListener').mockImplementation((type, listener) => {
			if (type === 'keydown') {
				savedListener = listener as ((e: KeyboardEvent) => void)
			}
		})

		let attachListeners!: () => void
		const TestComponent = defineComponent({
			setup() {
				const result = useCalendarKeyboardNavigation({
					isDatePickerVisible,
					datePickerRef,
					getCurrentDate,
					setCurrentDate,
				})

				datePickerRef.value = null

				attachListeners = result.attachListeners
				return () => null
			},
		})

		mount(TestComponent)

		attachListeners()
		vi.advanceTimersByTime(150)

		expect(savedListener).toBeTruthy()

		const preventDefault = vi.fn()
		const event = new KeyboardEvent('keydown', {
			key: 'ArrowRight',
			altKey: true,
			ctrlKey: false,
			metaKey: false,
		})
		Object.defineProperty(event, 'preventDefault', { value: preventDefault })
		Object.defineProperty(event, 'target', { value: document.createElement('div') })

		savedListener!(event)

		expect(setCurrentDate).not.toHaveBeenCalled()
		expect(preventDefault).not.toHaveBeenCalled()

		addEventListenerSpy.mockRestore()
		vi.useRealTimers()
	})

	it('handles Home/End/PageUp/PageDown navigation', () => {
		vi.useFakeTimers()
		const isDatePickerVisible = ref(true)
		const getCurrentDate = vi.fn(() => new Date(2023, 0, 15))
		const setCurrentDate = vi.fn()

		let savedListener: ((e: KeyboardEvent) => void) | null = null
		const addEventListenerSpy = vi.spyOn(document, 'addEventListener').mockImplementation((type, listener) => {
			if (type === 'keydown') savedListener = listener as (e: KeyboardEvent) => void
		})

		let attachListeners!: () => void
		const TestComponent = defineComponent({
			setup() {
				const result = useCalendarKeyboardNavigation({
					isDatePickerVisible,
					datePickerRef: ref(null),
					getCurrentDate,
					setCurrentDate,
				})
				attachListeners = result.attachListeners
				return () => null
			},
		})
		mount(TestComponent)
		attachListeners()
		vi.advanceTimersByTime(150)

		const fireKey = (key: string, shiftKey = false) => {
			setCurrentDate.mockClear()
			const event = new KeyboardEvent('keydown', { key, shiftKey, bubbles: true })
			Object.defineProperty(event, 'target', { value: document.createElement('div') })
			savedListener!(event)
			return setCurrentDate.mock.calls[0]?.[0] as Date | undefined
		}

		// Home → premier jour de la semaine affichée (lundi 9 Jan)
		const homeDate = fireKey('Home')
		expect(homeDate?.getDate()).toBe(9)
		expect(homeDate?.getMonth()).toBe(0)

		// End → dernier jour de la semaine affichée (dimanche 15 Jan)
		const endDate = fireKey('End')
		expect(endDate?.getDate()).toBe(15)

		// PageUp → même jour du mois précédent (15 Dec 2022)
		const pageUpDate = fireKey('PageUp')
		expect(pageUpDate?.getDate()).toBe(15)
		expect(pageUpDate?.getMonth()).toBe(11)
		expect(pageUpDate?.getFullYear()).toBe(2022)

		// PageDown → même jour du mois suivant (15 Feb 2023)
		const pageDownDate = fireKey('PageDown')
		expect(pageDownDate?.getDate()).toBe(15)
		expect(pageDownDate?.getMonth()).toBe(1)

		// PageUp + Shift → même jour l'année précédente (15 Jan 2022)
		const pageUpShiftDate = fireKey('PageUp', true)
		expect(pageUpShiftDate?.getFullYear()).toBe(2022)

		// PageDown + Shift → même jour l'année suivante (15 Jan 2024)
		const pageDownShiftDate = fireKey('PageDown', true)
		expect(pageDownShiftDate?.getFullYear()).toBe(2024)

		addEventListenerSpy.mockRestore()
		vi.useRealTimers()
	})

	it('handles Enter/Space on a day cell', () => {
		vi.useFakeTimers()
		const isDatePickerVisible = ref(true)
		const setCurrentDate = vi.fn()
		const onSelectDate = vi.fn()

		// Créer un rootEl contenant la cellule de jour pour résoudre la date active
		const rootEl = document.createElement('div')
		const dayWrapper = document.createElement('div')
		dayWrapper.setAttribute('data-v-date', '2023-01-10')
		dayWrapper.className = 'v-date-picker-month__day'
		const btn = document.createElement('button')
		btn.type = 'button'
		dayWrapper.appendChild(btn)
		rootEl.appendChild(dayWrapper)
		document.body.appendChild(rootEl)

		// Le listener est attaché sur rootEl (fallback datePickerEl = rootEl), pas sur document
		let savedListener: ((e: KeyboardEvent) => void) | null = null
		const addSpy = vi.spyOn(rootEl, 'addEventListener').mockImplementation((type, listener) => {
			if (type === 'keydown') savedListener = listener as (e: KeyboardEvent) => void
		})

		let attachListeners!: () => void
		const TestComponent = defineComponent({
			setup() {
				const result = useCalendarKeyboardNavigation({
					isDatePickerVisible,
					datePickerRef: ref({ $el: rootEl } as unknown as ComponentPublicInstance),
					getCurrentDate: vi.fn(() => new Date(2023, 0, 10)),
					setCurrentDate,
					onSelectDate,
				})
				attachListeners = result.attachListeners
				return () => null
			},
		})
		mount(TestComponent)
		attachListeners()
		vi.advanceTimersByTime(150)

		const enterEvent = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
		Object.defineProperty(enterEvent, 'target', { value: btn })
		savedListener!(enterEvent)

		expect(setCurrentDate).toHaveBeenCalledWith(new Date(2023, 0, 10))
		expect(onSelectDate).toHaveBeenCalledWith(new Date(2023, 0, 10))

		setCurrentDate.mockClear()
		onSelectDate.mockClear()

		const spaceEvent = new KeyboardEvent('keydown', { key: ' ', bubbles: true })
		Object.defineProperty(spaceEvent, 'target', { value: btn })
		savedListener!(spaceEvent)

		expect(setCurrentDate).toHaveBeenCalledWith(new Date(2023, 0, 10))
		expect(onSelectDate).toHaveBeenCalledWith(new Date(2023, 0, 10))
		document.body.removeChild(rootEl)

		addSpy.mockRestore()
		vi.useRealTimers()
	})

	it('handles Enter on header button (month/year control)', () => {
		vi.useFakeTimers()
		const isDatePickerVisible = ref(true)
		const setCurrentDate = vi.fn()

		let savedListener: ((e: KeyboardEvent) => void) | null = null
		const addEventListenerSpy = vi.spyOn(document, 'addEventListener').mockImplementation((type, listener) => {
			if (type === 'keydown') savedListener = listener as (e: KeyboardEvent) => void
		})

		let attachListeners!: () => void
		const TestComponent = defineComponent({
			setup() {
				const result = useCalendarKeyboardNavigation({
					isDatePickerVisible,
					datePickerRef: ref(null),
					getCurrentDate: vi.fn(() => null),
					setCurrentDate,
				})
				attachListeners = result.attachListeners
				return () => null
			},
		})
		mount(TestComponent)
		attachListeners()
		vi.advanceTimersByTime(150)

		// Simuler un bouton dans les contrôles d'entête
		const controls = document.createElement('div')
		controls.className = 'v-date-picker-controls'
		const headerBtn = document.createElement('button')
		const clickSpy = vi.spyOn(headerBtn, 'click')
		controls.appendChild(headerBtn)
		document.body.appendChild(controls)

		const enterEvent = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
		Object.defineProperty(enterEvent, 'target', { value: headerBtn })
		savedListener!(enterEvent)

		expect(clickSpy).toHaveBeenCalled()
		document.body.removeChild(controls)

		addEventListenerSpy.mockRestore()
		vi.useRealTimers()
	})

	it('handles ArrowLeft/Right/Up/Down in month dialog', () => {
		vi.useFakeTimers()
		const isDatePickerVisible = ref(true)
		const setCurrentDate = vi.fn()

		let savedListener: ((e: KeyboardEvent) => void) | null = null
		const addEventListenerSpy = vi.spyOn(document, 'addEventListener').mockImplementation((type, listener) => {
			if (type === 'keydown') savedListener = listener as (e: KeyboardEvent) => void
		})

		let attachListeners!: () => void
		const TestComponent = defineComponent({
			setup() {
				const result = useCalendarKeyboardNavigation({
					isDatePickerVisible,
					datePickerRef: ref(null),
					getCurrentDate: vi.fn(() => null),
					setCurrentDate,
				})
				attachListeners = result.attachListeners
				return () => null
			},
		})
		mount(TestComponent)
		attachListeners()
		vi.advanceTimersByTime(150)

		// Créer 3 boutons de mois dans le DOM
		const monthsContainer = document.createElement('div')
		monthsContainer.className = 'v-date-picker-months'
		const buttons = Array.from({ length: 3 }, (_, i) => {
			const b = document.createElement('button')
			b.textContent = `Month ${i + 1}`
			monthsContainer.appendChild(b)
			return b
		})
		document.body.appendChild(monthsContainer)

		const fireMonthKey = (key: string, targetBtn: HTMLButtonElement) => {
			const event = new KeyboardEvent('keydown', { key, bubbles: true })
			Object.defineProperty(event, 'target', { value: targetBtn })
			savedListener!(event)
		}

		const focusSpy = vi.spyOn(buttons[1]!, 'focus')
		// ArrowRight depuis bouton 0 → focus sur bouton 1
		fireMonthKey('ArrowRight', buttons[0]!)
		expect(focusSpy).toHaveBeenCalled()

		// Enter sur un bouton de mois
		const clickSpy = vi.spyOn(buttons[0]!, 'click')
		fireMonthKey('Enter', buttons[0]!)
		expect(clickSpy).toHaveBeenCalled()

		document.body.removeChild(monthsContainer)
		addEventListenerSpy.mockRestore()
		vi.useRealTimers()
	})

	it('handles ArrowLeft/Right in year dialog', () => {
		vi.useFakeTimers()
		const isDatePickerVisible = ref(true)
		const setCurrentDate = vi.fn()

		let savedListener: ((e: KeyboardEvent) => void) | null = null
		const addEventListenerSpy = vi.spyOn(document, 'addEventListener').mockImplementation((type, listener) => {
			if (type === 'keydown') savedListener = listener as (e: KeyboardEvent) => void
		})

		let attachListeners!: () => void
		const TestComponent = defineComponent({
			setup() {
				const result = useCalendarKeyboardNavigation({
					isDatePickerVisible,
					datePickerRef: ref(null),
					getCurrentDate: vi.fn(() => null),
					setCurrentDate,
				})
				attachListeners = result.attachListeners
				return () => null
			},
		})
		mount(TestComponent)
		attachListeners()
		vi.advanceTimersByTime(150)

		// Créer 3 boutons d'années dans le DOM
		const yearsContainer = document.createElement('div')
		yearsContainer.className = 'v-date-picker-years'
		const buttons = Array.from({ length: 3 }, (_, i) => {
			const b = document.createElement('button')
			b.textContent = `${2020 + i}`
			yearsContainer.appendChild(b)
			return b
		})
		document.body.appendChild(yearsContainer)

		const fireYearKey = (key: string, targetBtn: HTMLButtonElement) => {
			const event = new KeyboardEvent('keydown', { key, bubbles: true })
			Object.defineProperty(event, 'target', { value: targetBtn })
			savedListener!(event)
		}

		const focusSpy = vi.spyOn(buttons[1]!, 'focus')
		// ArrowRight depuis bouton 0 → focus sur bouton 1
		fireYearKey('ArrowRight', buttons[0]!)
		expect(focusSpy).toHaveBeenCalled()

		// Enter sur un bouton d'année
		const clickSpy = vi.spyOn(buttons[0]!, 'click')
		fireYearKey('Enter', buttons[0]!)
		expect(clickSpy).toHaveBeenCalled()

		document.body.removeChild(yearsContainer)
		addEventListenerSpy.mockRestore()
		vi.useRealTimers()
	})

	it('attaches on datePickerEl when no containerEl and detaches from it', () => {
		vi.useFakeTimers()
		const isDatePickerVisible = ref(true)

		// Créer un rootEl avec .v-date-picker dedans
		const rootEl = document.createElement('div')
		const datePickerEl = document.createElement('div')
		datePickerEl.className = 'v-date-picker'
		rootEl.appendChild(datePickerEl)
		document.body.appendChild(rootEl)

		const addSpy = vi.spyOn(datePickerEl, 'addEventListener')
		const removeSpy = vi.spyOn(datePickerEl, 'removeEventListener')

		let detachListeners!: () => void
		const TestComponent = defineComponent({
			setup() {
				const result = useCalendarKeyboardNavigation({
					isDatePickerVisible,
					datePickerRef: ref({ $el: rootEl } as unknown as ComponentPublicInstance),
					getCurrentDate: vi.fn(() => null),
					setCurrentDate: vi.fn(),
				})
				detachListeners = result.detachListeners
				result.attachListeners()
				vi.advanceTimersByTime(150)
				return () => null
			},
		})
		mount(TestComponent)

		expect(addSpy).toHaveBeenCalledWith('keydown', expect.any(Function), true)

		detachListeners()
		expect(removeSpy).toHaveBeenCalledWith('keydown', expect.any(Function), true)

		document.body.removeChild(rootEl)
		vi.useRealTimers()
	})

	it('does not attach listener when already attached', () => {
		vi.useFakeTimers()
		const isDatePickerVisible = ref(true)

		const addSpy = vi.spyOn(document, 'addEventListener')
		let attachListeners!: () => void

		const TestComponent = defineComponent({
			setup() {
				const result = useCalendarKeyboardNavigation({
					isDatePickerVisible,
					datePickerRef: ref(null),
					getCurrentDate: vi.fn(() => null),
					setCurrentDate: vi.fn(),
				})
				attachListeners = result.attachListeners
				return () => null
			},
		})
		mount(TestComponent)

		const callsBefore = addSpy.mock.calls.length
		attachListeners()
		vi.advanceTimersByTime(150)
		const callsAfterFirst = addSpy.mock.calls.length - callsBefore

		// Second attach ne doit pas ajouter de listener supplémentaire
		attachListeners()
		vi.advanceTimersByTime(150)
		const callsAfterSecond = addSpy.mock.calls.length - callsBefore

		expect(callsAfterSecond).toBe(callsAfterFirst)

		addSpy.mockRestore()
		vi.useRealTimers()
	})

	it('focusInitialDay focuses the target date button when it exists in the DOM', () => {
		const isDatePickerVisible = ref(true)
		const rootEl = document.createElement('div')

		// Simulate a day button for 2023-06-15
		const dayCell = document.createElement('div')
		dayCell.setAttribute('data-v-date', '2023-06-15')
		dayCell.setAttribute('role', 'gridcell')
		const dayBtn = document.createElement('button')
		dayBtn.type = 'button'
		dayCell.appendChild(dayBtn)
		rootEl.appendChild(dayCell)

		const focusSpy = vi.spyOn(dayCell, 'focus')

		let focusInitialDay!: () => void
		const TestComponent = defineComponent({
			setup() {
				const result = useCalendarKeyboardNavigation({
					isDatePickerVisible,
					datePickerRef: ref({ $el: rootEl } as unknown as ComponentPublicInstance),
					getInitialFocusDate: () => new Date(2023, 5, 15),
					getCurrentDate: vi.fn(() => null),
					setCurrentDate: vi.fn(),
				})
				focusInitialDay = result.focusInitialDay
				return () => null
			},
		})
		mount(TestComponent)

		focusInitialDay()
		expect(focusSpy).toHaveBeenCalledWith({ preventScroll: true })
		expect(dayCell.getAttribute('tabindex')).toBe('-1')
	})

	it('focusInitialDay does nothing when rootEl is missing', () => {
		const isDatePickerVisible = ref(true)

		let focusInitialDay!: () => void
		const TestComponent = defineComponent({
			setup() {
				const result = useCalendarKeyboardNavigation({
					isDatePickerVisible,
					datePickerRef: ref(null),
					getInitialFocusDate: () => new Date(2023, 5, 15),
					getCurrentDate: vi.fn(() => null),
					setCurrentDate: vi.fn(),
				})
				focusInitialDay = result.focusInitialDay
				return () => null
			},
		})
		mount(TestComponent)

		// Should not throw
		expect(() => focusInitialDay()).not.toThrow()
	})

	it('focusInitialDay falls back to first non-adjacent day when target date is not in displayed month', () => {
		const isDatePickerVisible = ref(true)
		const rootEl = document.createElement('div')

		// Simulate October 2026 calendar with adjacent days from September
		// Adjacent day (Sept 28) - has adjacent class
		const adjCell = document.createElement('div')
		adjCell.setAttribute('data-v-date', '2026-09-28')
		adjCell.className = 'v-date-picker-month__day v-date-picker-month__day--adjacent'
		adjCell.setAttribute('role', 'gridcell')
		const adjBtn = document.createElement('button')
		adjBtn.type = 'button'
		adjCell.appendChild(adjBtn)
		rootEl.appendChild(adjCell)

		// Adjacent day (Sept 29)
		const adjCell2 = document.createElement('div')
		adjCell2.setAttribute('data-v-date', '2026-09-29')
		adjCell2.className = 'v-date-picker-month__day v-date-picker-month__day--adjacent'
		adjCell2.setAttribute('role', 'gridcell')
		const adjBtn2 = document.createElement('button')
		adjBtn2.type = 'button'
		adjCell2.appendChild(adjBtn2)
		rootEl.appendChild(adjCell2)

		// Adjacent day (Sept 30)
		const adjCell3 = document.createElement('div')
		adjCell3.setAttribute('data-v-date', '2026-09-30')
		adjCell3.className = 'v-date-picker-month__day v-date-picker-month__day--adjacent'
		adjCell3.setAttribute('role', 'gridcell')
		const adjBtn3 = document.createElement('button')
		adjBtn3.type = 'button'
		adjCell3.appendChild(adjBtn3)
		rootEl.appendChild(adjCell3)

		// First real day of October (Oct 1) - no adjacent class
		const octCell = document.createElement('div')
		octCell.setAttribute('data-v-date', '2026-10-01')
		octCell.className = 'v-date-picker-month__day'
		octCell.setAttribute('role', 'gridcell')
		const octBtn = document.createElement('button')
		octBtn.type = 'button'
		octCell.appendChild(octBtn)
		rootEl.appendChild(octCell)

		// Another day of October
		const octCell2 = document.createElement('div')
		octCell2.setAttribute('data-v-date', '2026-10-02')
		octCell2.className = 'v-date-picker-month__day'
		octCell2.setAttribute('role', 'gridcell')
		const octBtn2 = document.createElement('button')
		octBtn2.type = 'button'
		octCell2.appendChild(octBtn2)
		rootEl.appendChild(octCell2)

		const adjFocusSpy = vi.spyOn(adjCell, 'focus')
		const octFocusSpy = vi.spyOn(octCell, 'focus')

		let focusInitialDay!: () => void
		const TestComponent = defineComponent({
			setup() {
				const result = useCalendarKeyboardNavigation({
					isDatePickerVisible,
					datePickerRef: ref({ $el: rootEl } as unknown as ComponentPublicInstance),
					// Target date is July 9 - not in October calendar
					getInitialFocusDate: () => new Date(2026, 6, 9),
					getCurrentDate: vi.fn(() => null),
					setCurrentDate: vi.fn(),
				})
				focusInitialDay = result.focusInitialDay
				return () => null
			},
		})
		mount(TestComponent)

		focusInitialDay()

		// Should NOT focus the adjacent day
		expect(adjFocusSpy).not.toHaveBeenCalled()
		// Should focus the first non-adjacent day (Oct 1)
		expect(octFocusSpy).toHaveBeenCalledWith({ preventScroll: true })
	})

	it('focusInitialDay does not focus anything when no day buttons exist', () => {
		const isDatePickerVisible = ref(true)
		const rootEl = document.createElement('div')
		// Empty root - no day cells

		let focusInitialDay!: () => void
		const TestComponent = defineComponent({
			setup() {
				const result = useCalendarKeyboardNavigation({
					isDatePickerVisible,
					datePickerRef: ref({ $el: rootEl } as unknown as ComponentPublicInstance),
					getInitialFocusDate: () => new Date(2023, 5, 15),
					getCurrentDate: vi.fn(() => null),
					setCurrentDate: vi.fn(),
				})
				focusInitialDay = result.focusInitialDay
				return () => null
			},
		})
		mount(TestComponent)

		// Should not throw
		expect(() => focusInitialDay()).not.toThrow()
	})

	it('focusInitialDay is called when date picker becomes visible', async () => {
		const isDatePickerVisible = ref(false)
		const rootEl = document.createElement('div')

		const dayCell = document.createElement('div')
		dayCell.setAttribute('data-v-date', '2023-06-15')
		const dayBtn = document.createElement('button')
		dayBtn.type = 'button'
		dayCell.appendChild(dayBtn)
		rootEl.appendChild(dayCell)

		const focusSpy = vi.spyOn(dayBtn, 'focus')

		const TestComponent = defineComponent({
			setup() {
				useCalendarKeyboardNavigation({
					isDatePickerVisible,
					datePickerRef: ref({ $el: rootEl } as unknown as ComponentPublicInstance),
					getInitialFocusDate: () => new Date(2023, 5, 15),
					getCurrentDate: vi.fn(() => null),
					setCurrentDate: vi.fn(),
				})
				return () => null
			},
		})
		mount(TestComponent)

		isDatePickerVisible.value = true
		await nextTick() // watcher triggers
		await nextTick() // attachListeners + nextTick(focusInitialDay)
		await nextTick() // focusInitialDay runs

		expect(focusSpy).toHaveBeenCalledWith({ preventScroll: true })
	})
})
