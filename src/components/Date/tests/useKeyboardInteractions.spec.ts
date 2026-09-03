import { describe, expect, it } from 'vitest'
import { nextTick, ref } from 'vue'
import useKeyboardInteractions from '../useInteractions'

describe('useKeyboardInteractions', () => {
	it('follows the focused day into its month when it is outside the displayed one', async () => {
		const displayedMonth = ref<Date | undefined>(new Date(2024, 5, 15))
		const { focusDay, focusedDay } = useKeyboardInteractions(displayedMonth, ref(), false, undefined, () => {})

		focusDay(new Date(2024, 6, 20))
		await nextTick()

		expect(focusedDay.value).toBe('2024-07-20')
		expect(displayedMonth.value?.getMonth()).toBe(6)
	})

	it('exposes bindable keyboard interactions', () => {
		const displayedMonth = ref<Date | undefined>(new Date(2024, 5, 15))
		const rootElement = document.createElement('div')
		rootElement.innerHTML = '<table><tbody><tr><td class="day-2024-06-02"></td></tr></tbody></table>'
		const { focusedDay, keyboardInteractions } = useKeyboardInteractions(displayedMonth, ref(rootElement), false, undefined, () => {})
		const event = new KeyboardEvent('keydown', { key: 'ArrowRight', cancelable: true })

		keyboardInteractions.onKeydown(event)

		expect(event.defaultPrevented).toBe(true)
		expect(focusedDay.value).toBe('2024-06-02')
	})

	it('cancels the pending range selection on Escape', () => {
		const displayedMonth = ref<Date | undefined>(new Date(2024, 5, 15))
		const { keyboardInteractions, click, previewRange, previewedInterval } = useKeyboardInteractions(displayedMonth, ref(), true, undefined, () => {})

		click(new Date(2024, 5, 10))
		previewRange(new Date(2024, 5, 15))
		expect(previewedInterval.value).toEqual(['2024-06-10', '2024-06-15'])

		keyboardInteractions.onKeydown(new KeyboardEvent('keydown', { key: 'Escape', cancelable: true }))

		expect(previewedInterval.value).toBeNull()
	})
})
