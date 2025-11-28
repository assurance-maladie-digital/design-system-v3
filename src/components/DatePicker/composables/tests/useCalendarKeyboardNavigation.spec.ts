import { describe, it, expect, vi } from 'vitest'
import { ref, nextTick, type ComponentPublicInstance } from 'vue'
import { useCalendarKeyboardNavigation } from '../useCalendarKeyboardNavigation'

describe('useCalendarKeyboardNavigation', () => {
	it('attaches and detaches keydown listener based on visibility', async () => {
		const isDatePickerVisible = ref(false)
		const datePickerRef = ref<ComponentPublicInstance | null>(null)
		const getCurrentDate = vi.fn(() => null)
		const setCurrentDate = vi.fn()

		const addEventListenerSpy = vi.spyOn(document, 'addEventListener')
		const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')

		useCalendarKeyboardNavigation({
			isDatePickerVisible,
			datePickerRef,
			getCurrentDate,
			setCurrentDate,
		})

		// When the date picker becomes visible, a keydown listener should be attached
		isDatePickerVisible.value = true
		await nextTick()
		await nextTick()
		expect(addEventListenerSpy).toHaveBeenCalled()

		// When it becomes hidden, the listener should be detached
		isDatePickerVisible.value = false
		await nextTick()
		expect(removeEventListenerSpy).toHaveBeenCalled()

		addEventListenerSpy.mockRestore()
		removeEventListenerSpy.mockRestore()
	})

	it('moves one day forward on ArrowRight from a day cell and focuses the next day', async () => {
		const isDatePickerVisible = ref(true)

		const rootEl = document.createElement('div')

		// Current day cell
		const currentCell = document.createElement('div')
		currentCell.setAttribute('data-v-date', '2023-01-10')
		const currentButton = document.createElement('button')
		currentButton.type = 'button'
		currentCell.appendChild(currentButton)
		rootEl.appendChild(currentCell)

		// Next day cell
		const nextCell = document.createElement('div')
		nextCell.setAttribute('data-v-date', '2023-01-11')
		const nextButton = document.createElement('button')
		nextButton.type = 'button'
		const focusSpy = vi.fn()
		nextButton.focus = focusSpy
		nextCell.appendChild(nextButton)
		rootEl.appendChild(nextCell)

		const datePickerRef = ref<ComponentPublicInstance | null>({ $el: rootEl } as unknown as ComponentPublicInstance)
		const getCurrentDate = vi.fn(() => new Date(2023, 0, 10))
		const setCurrentDate = vi.fn()

		let savedListener: EventListener | null = null
		const addEventListenerSpy = vi.spyOn(document, 'addEventListener').mockImplementation((type, listener) => {
			if (type === 'keydown') {
				savedListener = listener as EventListener
			}
		})

		const { attachListeners } = useCalendarKeyboardNavigation({
			isDatePickerVisible,
			datePickerRef,
			getCurrentDate,
			setCurrentDate,
		})

		attachListeners()
		expect(addEventListenerSpy).toHaveBeenCalled()
		expect(savedListener).toBeTruthy()

		// Simulate ArrowRight on the current day button
		const event = new KeyboardEvent('keydown', { key: 'ArrowRight' })
		Object.defineProperty(event, 'target', { value: currentButton })

		savedListener!(event)
		await nextTick()

		expect(setCurrentDate).toHaveBeenCalledTimes(1)
		const calledDate = setCurrentDate.mock.calls[0][0] as Date
		expect(calledDate).toBeInstanceOf(Date)
		expect(calledDate.getDate()).toBe(11)
		expect(focusSpy).toHaveBeenCalled()

		addEventListenerSpy.mockRestore()
	})

	it('falls back to getCurrentDate when event target is not a day cell', () => {
		const isDatePickerVisible = ref(true)
		const datePickerRef = ref<ComponentPublicInstance | null>(null)
		const baseDate = new Date(2023, 0, 10)
		const getCurrentDate = vi.fn(() => baseDate)
		const setCurrentDate = vi.fn()

		let savedListener: EventListener | null = null
		const addEventListenerSpy = vi.spyOn(document, 'addEventListener').mockImplementation((type, listener) => {
			if (type === 'keydown') {
				savedListener = listener as EventListener
			}
		})

		const { attachListeners } = useCalendarKeyboardNavigation({
			isDatePickerVisible,
			datePickerRef,
			getCurrentDate,
			setCurrentDate,
		})

		attachListeners()
		expect(addEventListenerSpy).toHaveBeenCalled()
		expect(savedListener).toBeTruthy()

		const preventDefault = vi.fn()
		const event = {
			key: 'ArrowRight',
			altKey: false,
			ctrlKey: false,
			metaKey: false,
			preventDefault,
			target: document.createElement('button'),
		} as unknown as Event

		savedListener!(event)

		expect(preventDefault).toHaveBeenCalled()
		expect(setCurrentDate).toHaveBeenCalledTimes(1)
		expect(setCurrentDate).toHaveBeenCalledWith(baseDate)

		addEventListenerSpy.mockRestore()
	})

	it('does not react to non-arrow keys', () => {
		const isDatePickerVisible = ref(true)
		const datePickerRef = ref<ComponentPublicInstance | null>(null)
		const getCurrentDate = vi.fn(() => new Date(2023, 0, 10))
		const setCurrentDate = vi.fn()

		let savedListener: EventListener | null = null
		const addEventListenerSpy = vi.spyOn(document, 'addEventListener').mockImplementation((type, listener) => {
			if (type === 'keydown') {
				savedListener = listener as EventListener
			}
		})

		const { attachListeners } = useCalendarKeyboardNavigation({
			isDatePickerVisible,
			datePickerRef,
			getCurrentDate,
			setCurrentDate,
		})

		attachListeners()
		expect(savedListener).toBeTruthy()

		const preventDefault = vi.fn()
		const event = {
			key: 'A',
			altKey: false,
			ctrlKey: false,
			metaKey: false,
			preventDefault,
			target: document.createElement('div'),
		} as unknown as Event

		savedListener!(event)

		expect(setCurrentDate).not.toHaveBeenCalled()
		expect(preventDefault).not.toHaveBeenCalled()

		addEventListenerSpy.mockRestore()
	})

	it('ignores arrow keys when modifier keys are pressed', () => {
		const isDatePickerVisible = ref(true)
		const datePickerRef = ref<ComponentPublicInstance | null>(null)
		const getCurrentDate = vi.fn(() => new Date(2023, 0, 10))
		const setCurrentDate = vi.fn()

		let savedListener: EventListener | null = null
		const addEventListenerSpy = vi.spyOn(document, 'addEventListener').mockImplementation((type, listener) => {
			if (type === 'keydown') {
				savedListener = listener as EventListener
			}
		})

		const { attachListeners } = useCalendarKeyboardNavigation({
			isDatePickerVisible,
			datePickerRef,
			getCurrentDate,
			setCurrentDate,
		})

		attachListeners()
		expect(savedListener).toBeTruthy()

		const preventDefault = vi.fn()
		const event = {
			key: 'ArrowRight',
			altKey: true,
			ctrlKey: false,
			metaKey: false,
			preventDefault,
			target: document.createElement('div'),
		} as unknown as Event

		savedListener!(event)

		expect(setCurrentDate).not.toHaveBeenCalled()
		expect(preventDefault).not.toHaveBeenCalled()

		addEventListenerSpy.mockRestore()
	})
})
