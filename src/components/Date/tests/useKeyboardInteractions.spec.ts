import { describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import useKeyboardInteractions from '../useInteractions'

describe('useKeyboardInteractions', () => {
	it('follows the focused day into its month when it is outside the displayed one', async () => {
		const displayedMonth = ref<Date | undefined>(new Date(2024, 5, 15))
		const { focusDay, focusedDay } = useKeyboardInteractions(displayedMonth, ref(), false, () => {})

		focusDay(new Date(2024, 6, 20))
		await nextTick()

		expect(focusedDay.value).toBe('2024-07-20')
		expect(displayedMonth.value?.getMonth()).toBe(6)
	})

	it('exposes bindable keyboard interactions', () => {
		const displayedMonth = ref<Date | undefined>(new Date(2024, 5, 15))
		const rootElement = document.createElement('div')
		rootElement.innerHTML = '<table><tbody><tr><td class="day-2024-06-02"></td></tr></tbody></table>'
		const { focusedDay, keyboardInteractions } = useKeyboardInteractions(displayedMonth, ref(rootElement), false, () => {})
		const event = new KeyboardEvent('keydown', { key: 'ArrowRight', cancelable: true })

		keyboardInteractions.onKeydown(event)

		expect(event.defaultPrevented).toBe(true)
		expect(focusedDay.value).toBe('2024-06-02')
	})

	it('cancels the pending range selection on Escape and consumes the event', () => {
		const displayedMonth = ref<Date | undefined>(new Date(2024, 5, 15))
		const { keyboardInteractions, click, previewRange, previewedRange } = useKeyboardInteractions(displayedMonth, ref(), true, () => {})

		click(new Date(2024, 5, 10))
		previewRange(new Date(2024, 5, 15))
		expect(previewedRange.value).toEqual(['2024-06-10', '2024-06-15'])

		const event = new KeyboardEvent('keydown', { key: 'Escape', cancelable: true })
		const stopPropagation = vi.spyOn(event, 'stopPropagation')
		keyboardInteractions.onKeydown(event)

		expect(previewedRange.value).toBeNull()
		// The event must not reach an embedding picker (e.g. to close its menu)
		expect(stopPropagation).toHaveBeenCalled()
	})

	it('lets Escape propagate when no selection is in progress', () => {
		const displayedMonth = ref<Date | undefined>(new Date(2024, 5, 15))
		const { keyboardInteractions } = useKeyboardInteractions(displayedMonth, ref(), true, () => {})

		const event = new KeyboardEvent('keydown', { key: 'Escape', cancelable: true })
		const stopPropagation = vi.spyOn(event, 'stopPropagation')
		keyboardInteractions.onKeydown(event)

		expect(stopPropagation).not.toHaveBeenCalled()
	})
})
