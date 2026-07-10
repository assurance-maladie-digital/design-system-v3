import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useDatePickerFocusTrap } from '../useDatePickerFocusTrap'
import { ref } from 'vue'
import type { Ref, ComponentPublicInstance } from 'vue'

describe('useDatePickerFocusTrap', () => {
	let isDatePickerVisible: Ref<boolean>
	let datePickerRef: Ref<ComponentPublicInstance | null>
	let onClose: () => void
	let restoreFocus: () => void

	beforeEach(() => {
		isDatePickerVisible = ref(true)
		datePickerRef = ref<ComponentPublicInstance | null>(null)
		onClose = vi.fn()
		restoreFocus = vi.fn()
	})

	it('should do nothing if date picker is closed', () => {
		isDatePickerVisible.value = false
		const { handleMenuKeydown } = useDatePickerFocusTrap({
			isDatePickerVisible,
			datePickerRef,
		})

		const event = new KeyboardEvent('keydown', { key: 'Tab' })
		const preventDefault = vi.spyOn(event, 'preventDefault')
		handleMenuKeydown(event)

		expect(preventDefault).not.toHaveBeenCalled()
	})

	it('should close and restore focus on Escape', () => {
		const { handleMenuKeydown } = useDatePickerFocusTrap({
			isDatePickerVisible,
			datePickerRef,
			onClose,
			restoreFocus,
		})

		const event = new KeyboardEvent('keydown', { key: 'Escape' })
		const preventDefault = vi.spyOn(event, 'preventDefault')
		const stopPropagation = vi.spyOn(event, 'stopPropagation')

		handleMenuKeydown(event)

		expect(isDatePickerVisible.value).toBe(false)
		expect(onClose).toHaveBeenCalled()
		expect(restoreFocus).toHaveBeenCalled()
		expect(preventDefault).toHaveBeenCalled()
		expect(stopPropagation).toHaveBeenCalled()
	})

	it('should let non-Tab keys pass without interference', () => {
		const { handleMenuKeydown } = useDatePickerFocusTrap({
			isDatePickerVisible,
			datePickerRef,
		})

		const event = new KeyboardEvent('keydown', { key: 'ArrowRight' })
		const preventDefault = vi.spyOn(event, 'preventDefault')

		handleMenuKeydown(event)

		expect(preventDefault).not.toHaveBeenCalled()
	})

	it('should focus Today button when Tab is pressed inside a date grid', () => {
		const rootEl = document.createElement('div')

		// Create Today button
		const todayButton = document.createElement('button')
		todayButton.className = 'date-picker__today-button'
		todayButton.focus = vi.fn()
		rootEl.appendChild(todayButton)

		// Create grid
		const grid = document.createElement('div')
		grid.className = 'v-date-picker-month'

		// Create active cell inside grid
		const cell = document.createElement('div')
		const cellBtn = document.createElement('button')
		cell.appendChild(cellBtn)
		grid.appendChild(cell)
		rootEl.appendChild(grid)

		datePickerRef.value = { $el: rootEl } as unknown as ComponentPublicInstance

		const { handleMenuKeydown } = useDatePickerFocusTrap({
			isDatePickerVisible,
			datePickerRef,
		})

		const event = new KeyboardEvent('keydown', { key: 'Tab' })
		Object.defineProperty(event, 'target', { value: cellBtn })
		const preventDefault = vi.spyOn(event, 'preventDefault')

		handleMenuKeydown(event)

		expect(preventDefault).toHaveBeenCalled()
		expect(todayButton.focus).toHaveBeenCalled()
	})

	it('should cycle focus normally if not in a grid', () => {
		const rootEl = document.createElement('div')

		const btn1 = document.createElement('button')
		btn1.focus = vi.fn()

		const btn2 = document.createElement('button')
		btn2.focus = vi.fn()

		rootEl.appendChild(btn1)
		rootEl.appendChild(btn2)

		datePickerRef.value = { $el: rootEl } as unknown as ComponentPublicInstance

		const { handleMenuKeydown } = useDatePickerFocusTrap({
			isDatePickerVisible,
			datePickerRef,
		})

		// Simuler le focus actuel sur btn1
		vi.spyOn(document, 'activeElement', 'get').mockReturnValue(btn1)

		const event = new KeyboardEvent('keydown', { key: 'Tab' })
		Object.defineProperty(event, 'target', { value: btn1 })

		handleMenuKeydown(event)

		expect(btn2.focus).toHaveBeenCalled()
	})

	it('should cycle focus backward with Shift+Tab', () => {
		const rootEl = document.createElement('div')

		const btn1 = document.createElement('button')
		btn1.focus = vi.fn()

		const btn2 = document.createElement('button')
		btn2.focus = vi.fn()

		rootEl.appendChild(btn1)
		rootEl.appendChild(btn2)

		datePickerRef.value = { $el: rootEl } as unknown as ComponentPublicInstance

		const { handleMenuKeydown } = useDatePickerFocusTrap({
			isDatePickerVisible,
			datePickerRef,
		})

		vi.spyOn(document, 'activeElement', 'get').mockReturnValue(btn2)

		const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true })
		Object.defineProperty(event, 'target', { value: btn2 })

		handleMenuKeydown(event)

		expect(btn1.focus).toHaveBeenCalled()
	})

	it('should cycle from last to first with Tab', () => {
		const rootEl = document.createElement('div')

		const btn1 = document.createElement('button')
		btn1.focus = vi.fn()

		const btn2 = document.createElement('button')
		btn2.focus = vi.fn()

		rootEl.appendChild(btn1)
		rootEl.appendChild(btn2)

		datePickerRef.value = { $el: rootEl } as unknown as ComponentPublicInstance

		const { handleMenuKeydown } = useDatePickerFocusTrap({
			isDatePickerVisible,
			datePickerRef,
		})

		vi.spyOn(document, 'activeElement', 'get').mockReturnValue(btn2)

		const event = new KeyboardEvent('keydown', { key: 'Tab' })
		Object.defineProperty(event, 'target', { value: btn2 })

		handleMenuKeydown(event)

		expect(btn1.focus).toHaveBeenCalled()
	})

	it('should cycle from first to last with Shift+Tab', () => {
		const rootEl = document.createElement('div')

		const btn1 = document.createElement('button')
		btn1.focus = vi.fn()

		const btn2 = document.createElement('button')
		btn2.focus = vi.fn()

		rootEl.appendChild(btn1)
		rootEl.appendChild(btn2)

		datePickerRef.value = { $el: rootEl } as unknown as ComponentPublicInstance

		const { handleMenuKeydown } = useDatePickerFocusTrap({
			isDatePickerVisible,
			datePickerRef,
		})

		vi.spyOn(document, 'activeElement', 'get').mockReturnValue(btn1)

		const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true })
		Object.defineProperty(event, 'target', { value: btn1 })

		handleMenuKeydown(event)

		expect(btn2.focus).toHaveBeenCalled()
	})

	it('should not move from day to day with Tab inside the grid', () => {
		const rootEl = document.createElement('div')

		const todayButton = document.createElement('button')
		todayButton.className = 'date-picker__today-button'
		todayButton.focus = vi.fn()
		rootEl.appendChild(todayButton)

		const grid = document.createElement('div')
		grid.className = 'v-date-picker-month'

		const day1 = document.createElement('button')
		day1.focus = vi.fn()
		const day2 = document.createElement('button')
		day2.focus = vi.fn()
		grid.appendChild(day1)
		grid.appendChild(day2)
		rootEl.appendChild(grid)

		datePickerRef.value = { $el: rootEl } as unknown as ComponentPublicInstance

		const { handleMenuKeydown } = useDatePickerFocusTrap({
			isDatePickerVisible,
			datePickerRef,
		})

		const event = new KeyboardEvent('keydown', { key: 'Tab' })
		Object.defineProperty(event, 'target', { value: day2 })

		handleMenuKeydown(event)

		expect(todayButton.focus).toHaveBeenCalled()
		expect(day1.focus).not.toHaveBeenCalled()
	})

	it('should move Shift+Tab from grid to the last focusable before the grid', () => {
		const rootEl = document.createElement('div')

		const prevButton = document.createElement('button')
		prevButton.className = 'prev-month'
		prevButton.focus = vi.fn()
		rootEl.appendChild(prevButton)

		const nextButton = document.createElement('button')
		nextButton.className = 'next-month'
		nextButton.focus = vi.fn()
		rootEl.appendChild(nextButton)

		const grid = document.createElement('div')
		grid.className = 'v-date-picker-month'
		const day1 = document.createElement('button')
		day1.focus = vi.fn()
		grid.appendChild(day1)
		rootEl.appendChild(grid)

		const todayButton = document.createElement('button')
		todayButton.className = 'date-picker__today-button'
		todayButton.focus = vi.fn()
		rootEl.appendChild(todayButton)

		datePickerRef.value = { $el: rootEl } as unknown as ComponentPublicInstance

		const { handleMenuKeydown } = useDatePickerFocusTrap({
			isDatePickerVisible,
			datePickerRef,
		})

		vi.spyOn(document, 'activeElement', 'get').mockReturnValue(day1)

		const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true })
		Object.defineProperty(event, 'target', { value: day1 })

		handleMenuKeydown(event)

		expect(nextButton.focus).toHaveBeenCalled()
		expect(prevButton.focus).not.toHaveBeenCalled()
	})

	it('should focus selected day when Shift+Tab from Today button', () => {
		const rootEl = document.createElement('div')

		const todayButton = document.createElement('button')
		todayButton.className = 'date-picker__today-button'
		todayButton.focus = vi.fn()
		rootEl.appendChild(todayButton)

		const grid = document.createElement('div')
		grid.className = 'v-date-picker-month'
		const selectedDay = document.createElement('button')
		selectedDay.setAttribute('data-v-date', '2024-06-15')
		selectedDay.focus = vi.fn()
		grid.appendChild(selectedDay)
		rootEl.appendChild(grid)

		datePickerRef.value = { $el: rootEl } as unknown as ComponentPublicInstance

		const { handleMenuKeydown } = useDatePickerFocusTrap({
			isDatePickerVisible,
			datePickerRef,
			getInitialFocusDate: () => new Date(2024, 5, 15),
		})

		vi.spyOn(document, 'activeElement', 'get').mockReturnValue(todayButton)

		const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true })
		Object.defineProperty(event, 'target', { value: todayButton })

		handleMenuKeydown(event)

		expect(selectedDay.focus).toHaveBeenCalled()
	})

	it('should focus selected day when Tab wraps from last focusable to grid', () => {
		const rootEl = document.createElement('div')

		const grid = document.createElement('div')
		grid.className = 'v-date-picker-month'
		const selectedDay = document.createElement('button')
		selectedDay.setAttribute('data-v-date', '2024-06-20')
		selectedDay.focus = vi.fn()
		grid.appendChild(selectedDay)
		rootEl.appendChild(grid)

		const todayButton = document.createElement('button')
		todayButton.className = 'date-picker__today-button'
		todayButton.focus = vi.fn()
		rootEl.appendChild(todayButton)

		const monthsButton = document.createElement('button')
		monthsButton.focus = vi.fn()
		rootEl.appendChild(monthsButton)

		datePickerRef.value = { $el: rootEl } as unknown as ComponentPublicInstance

		const { handleMenuKeydown } = useDatePickerFocusTrap({
			isDatePickerVisible,
			datePickerRef,
			getInitialFocusDate: () => new Date(2024, 5, 20),
		})

		vi.spyOn(document, 'activeElement', 'get').mockReturnValue(monthsButton)

		const event = new KeyboardEvent('keydown', { key: 'Tab' })
		Object.defineProperty(event, 'target', { value: monthsButton })

		handleMenuKeydown(event)

		expect(selectedDay.focus).toHaveBeenCalled()
		expect(todayButton.focus).not.toHaveBeenCalled()
	})

	it('should handle active element not in focusables via compareDocumentPosition', () => {
		const rootEl = document.createElement('div')

		const btn1 = document.createElement('button')
		btn1.focus = vi.fn()
		rootEl.appendChild(btn1)

		const nonFocusableGridDay = document.createElement('div')
		nonFocusableGridDay.setAttribute('tabindex', '-1')
		rootEl.appendChild(nonFocusableGridDay)

		const btn2 = document.createElement('button')
		btn2.focus = vi.fn()
		rootEl.appendChild(btn2)

		datePickerRef.value = { $el: rootEl } as unknown as ComponentPublicInstance

		const { handleMenuKeydown } = useDatePickerFocusTrap({
			isDatePickerVisible,
			datePickerRef,
		})

		vi.spyOn(document, 'activeElement', 'get').mockReturnValue(nonFocusableGridDay)

		const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true })
		Object.defineProperty(event, 'target', { value: nonFocusableGridDay })

		handleMenuKeydown(event)

		expect(btn1.focus).toHaveBeenCalled()
	})
})
