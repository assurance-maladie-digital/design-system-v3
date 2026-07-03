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
})
