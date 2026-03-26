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
		await nextTick()
		vi.runAllTimers() // Flush setTimeout inside tryAttach
		await nextTick()
		expect(addEventListenerSpy).toHaveBeenCalled()

		// When it becomes hidden, the listener should be detached
		isDatePickerVisible.value = false
		await nextTick()
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
		
		const addEventListenerSpy = vi.spyOn(rootEl, 'addEventListener').mockImplementation((type, listener) => {
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
				
				// Surcharger dynamiquement pour que ça ne cherche pas document.addEventListener
				datePickerRef.value = { $el: rootEl } as unknown as ComponentPublicInstance
				
				attachListeners()
				return () => null
			},
		})

		mount(TestComponent)
		vi.runAllTimers() // Flush setTimeout inside tryAttach
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
		const nextDate = setCurrentDate.mock.calls[0][0] as Date
		expect(nextDate.getDate()).toBe(11)

		// ArrowLeft: 10 Jan -> 9 Jan
		setCurrentDate.mockClear()
		const leftEvent = new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true })
		Object.defineProperty(leftEvent, 'target', { value: currentButton })
		if (savedListener) (savedListener as (e: KeyboardEvent) => void)(leftEvent)
		const prevDate = setCurrentDate.mock.calls[0][0] as Date
		expect(prevDate.getDate()).toBe(9)

		// ArrowUp: 10 Jan -> 3 Jan
		setCurrentDate.mockClear()
		const upEvent = new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true })
		Object.defineProperty(upEvent, 'target', { value: currentButton })
		if (savedListener) (savedListener as (e: KeyboardEvent) => void)(upEvent)
		const upDate = setCurrentDate.mock.calls[0][0] as Date
		expect(upDate.getDate()).toBe(3)

		// ArrowDown: 10 Jan -> 17 Jan
		setCurrentDate.mockClear()
		const downEvent = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true })
		Object.defineProperty(downEvent, 'target', { value: currentButton })
		if (savedListener) (savedListener as (e: KeyboardEvent) => void)(downEvent)
		const downDate = setCurrentDate.mock.calls[0][0] as Date
		expect(downDate.getDate()).toBe(17)

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
		
		const addEventListenerSpy = vi.spyOn(rootEl, 'addEventListener').mockImplementation((type, listener) => {
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
				
				datePickerRef.value = { $el: rootEl } as unknown as ComponentPublicInstance
				
				attachListeners = result.attachListeners
				return () => null
			},
		})

		mount(TestComponent)

		attachListeners()
		vi.runAllTimers() // Flush setTimeout inside tryAttach
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
		expect(setCurrentDate).toHaveBeenCalledWith(baseDate)

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
		
		const addEventListenerSpy = vi.spyOn(rootEl, 'addEventListener').mockImplementation((type, listener) => {
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
				
				datePickerRef.value = { $el: rootEl } as unknown as ComponentPublicInstance
				
				attachListeners = result.attachListeners
				return () => null
			},
		})

		mount(TestComponent)

		attachListeners()
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
		
		const addEventListenerSpy = vi.spyOn(rootEl, 'addEventListener').mockImplementation((type, listener) => {
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
				
				datePickerRef.value = { $el: rootEl } as unknown as ComponentPublicInstance
				
				attachListeners = result.attachListeners
				return () => null
			},
		})

		mount(TestComponent)

		attachListeners()
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
})
