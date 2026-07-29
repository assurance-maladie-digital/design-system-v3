// @vitest-environment jsdom

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useDatePickerFocusTrap } from '../useDatePickerFocusTrap'
import { ref } from 'vue'
import type { Ref, ComponentPublicInstance } from 'vue'

// Scénarios d'accessibilité pour le piège de focus du DatePicker :
// - Tab / Shift+Tab logiques et cycliques
// - Pas de navigation de jour en jour dans la grille
// - Retour au jour sélectionné quand on entre/sort de la grille
// - Escape ferme et restaure le focus

describe('useDatePickerFocusTrap – a11y keyboard navigation', () => {
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

	it('keeps Tab from moving between days inside the grid', () => {
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

	it('keeps Shift+Tab from moving between days inside the grid', () => {
		const rootEl = document.createElement('div')

		const nextButton = document.createElement('button')
		nextButton.focus = vi.fn()
		rootEl.appendChild(nextButton)

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

		vi.spyOn(document, 'activeElement', 'get').mockReturnValue(day2)

		const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true })
		Object.defineProperty(event, 'target', { value: day2 })

		handleMenuKeydown(event)

		expect(nextButton.focus).toHaveBeenCalled()
		expect(day1.focus).not.toHaveBeenCalled()
	})

	it('focuses the selected day when Tab enters the grid after wrap', () => {
		const rootEl = document.createElement('div')

		const grid = document.createElement('div')
		grid.className = 'v-date-picker-month'
		const selectedDayWrapper = document.createElement('div')
		selectedDayWrapper.setAttribute('data-v-date', '2024-06-20')
		selectedDayWrapper.setAttribute('role', 'gridcell')
		selectedDayWrapper.focus = vi.fn()
		const selectedDay = document.createElement('button')
		selectedDay.setAttribute('tabindex', '-1')
		selectedDayWrapper.appendChild(selectedDay)
		grid.appendChild(selectedDayWrapper)

		const firstDayWrapper = document.createElement('div')
		const firstDay = document.createElement('button')
		firstDay.focus = vi.fn()
		firstDayWrapper.appendChild(firstDay)
		grid.appendChild(firstDayWrapper)
		rootEl.appendChild(grid)

		const todayButton = document.createElement('button')
		todayButton.className = 'date-picker__today-button'
		todayButton.focus = vi.fn()
		rootEl.appendChild(todayButton)

		const nextButton = document.createElement('button')
		nextButton.focus = vi.fn()
		rootEl.appendChild(nextButton)

		datePickerRef.value = { $el: rootEl } as unknown as ComponentPublicInstance

		const { handleMenuKeydown } = useDatePickerFocusTrap({
			isDatePickerVisible,
			datePickerRef,
			getInitialFocusDate: () => new Date(2024, 5, 20),
		})

		vi.spyOn(document, 'activeElement', 'get').mockReturnValue(nextButton)

		const event = new KeyboardEvent('keydown', { key: 'Tab' })
		Object.defineProperty(event, 'target', { value: nextButton })

		handleMenuKeydown(event)

		expect(selectedDayWrapper.focus).toHaveBeenCalled()
		expect(firstDay.focus).not.toHaveBeenCalled()
	})

	it('focuses the selected day when Shift+Tab from Today button', () => {
		const rootEl = document.createElement('div')

		const todayButton = document.createElement('button')
		todayButton.className = 'date-picker__today-button'
		todayButton.focus = vi.fn()
		rootEl.appendChild(todayButton)

		const grid = document.createElement('div')
		grid.className = 'v-date-picker-month'
		const selectedDayWrapper = document.createElement('div')
		selectedDayWrapper.setAttribute('data-v-date', '2024-06-15')
		selectedDayWrapper.setAttribute('role', 'gridcell')
		selectedDayWrapper.focus = vi.fn()
		const selectedDay = document.createElement('button')
		selectedDay.setAttribute('tabindex', '-1')
		selectedDayWrapper.appendChild(selectedDay)
		grid.appendChild(selectedDayWrapper)
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

		expect(selectedDayWrapper.focus).toHaveBeenCalled()
	})

	it('exposes a logical cyclic tab order: today → months → prev → next → selected day', () => {
		const rootEl = document.createElement('div')

		const grid = document.createElement('div')
		grid.className = 'v-date-picker-month'
		const selectedDayWrapper = document.createElement('div')
		selectedDayWrapper.setAttribute('data-v-date', '2024-06-20')
		selectedDayWrapper.setAttribute('role', 'gridcell')
		selectedDayWrapper.focus = vi.fn()
		const selectedDay = document.createElement('button')
		selectedDay.setAttribute('tabindex', '-1')
		selectedDayWrapper.appendChild(selectedDay)
		grid.appendChild(selectedDayWrapper)
		rootEl.appendChild(grid)

		const todayButton = document.createElement('button')
		todayButton.className = 'date-picker__today-button'
		todayButton.focus = vi.fn()
		rootEl.appendChild(todayButton)

		const monthsButton = document.createElement('button')
		monthsButton.className = 'months-button'
		monthsButton.focus = vi.fn()
		rootEl.appendChild(monthsButton)

		const prevButton = document.createElement('button')
		prevButton.className = 'prev-button'
		prevButton.focus = vi.fn()
		rootEl.appendChild(prevButton)

		const nextButton = document.createElement('button')
		nextButton.className = 'next-button'
		nextButton.focus = vi.fn()
		rootEl.appendChild(nextButton)

		datePickerRef.value = { $el: rootEl } as unknown as ComponentPublicInstance

		const { handleMenuKeydown } = useDatePickerFocusTrap({
			isDatePickerVisible,
			datePickerRef,
			getInitialFocusDate: () => new Date(2024, 5, 20),
		})

		// today → months
		vi.spyOn(document, 'activeElement', 'get').mockReturnValue(todayButton)
		let event = new KeyboardEvent('keydown', { key: 'Tab' })
		Object.defineProperty(event, 'target', { value: todayButton })
		handleMenuKeydown(event)
		expect(monthsButton.focus).toHaveBeenCalled()

		// months → prev
		vi.spyOn(document, 'activeElement', 'get').mockReturnValue(monthsButton)
		event = new KeyboardEvent('keydown', { key: 'Tab' })
		Object.defineProperty(event, 'target', { value: monthsButton })
		handleMenuKeydown(event)
		expect(prevButton.focus).toHaveBeenCalled()

		// prev → next
		vi.spyOn(document, 'activeElement', 'get').mockReturnValue(prevButton)
		event = new KeyboardEvent('keydown', { key: 'Tab' })
		Object.defineProperty(event, 'target', { value: prevButton })
		handleMenuKeydown(event)
		expect(nextButton.focus).toHaveBeenCalled()

		// next → selectedDay (wrap)
		vi.spyOn(document, 'activeElement', 'get').mockReturnValue(nextButton)
		event = new KeyboardEvent('keydown', { key: 'Tab' })
		Object.defineProperty(event, 'target', { value: nextButton })
		handleMenuKeydown(event)
		expect(selectedDayWrapper.focus).toHaveBeenCalled()
	})

	it('reverses the tab order with Shift+Tab', () => {
		const rootEl = document.createElement('div')

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
		})

		vi.spyOn(document, 'activeElement', 'get').mockReturnValue(monthsButton)

		const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true })
		Object.defineProperty(event, 'target', { value: monthsButton })

		handleMenuKeydown(event)

		expect(todayButton.focus).toHaveBeenCalled()
	})

	it('delegates Escape handling to onClose when provided', () => {
		const rootEl = document.createElement('div')
		datePickerRef.value = { $el: rootEl } as unknown as ComponentPublicInstance

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

		expect(isDatePickerVisible.value).toBe(true)
		expect(onClose).toHaveBeenCalled()
		expect(restoreFocus).not.toHaveBeenCalled()
		expect(preventDefault).toHaveBeenCalled()
		expect(stopPropagation).toHaveBeenCalled()
	})

	it('does not block other keyboard interactions (arrow keys, Enter)', () => {
		const rootEl = document.createElement('div')
		datePickerRef.value = { $el: rootEl } as unknown as ComponentPublicInstance

		const { handleMenuKeydown } = useDatePickerFocusTrap({
			isDatePickerVisible,
			datePickerRef,
		})

		const arrowEvent = new KeyboardEvent('keydown', { key: 'ArrowRight' })
		const preventDefault = vi.spyOn(arrowEvent, 'preventDefault')

		handleMenuKeydown(arrowEvent)

		expect(preventDefault).not.toHaveBeenCalled()
	})
})
