import { describe, expect, it } from 'vitest'
import { nextTick, ref } from 'vue'
import useKeyboardInteractions from '../useInteractions'

describe('useKeyboardInteractions', () => {
	it('follows the focused day into its month when it is outside the displayed one', async () => {
		const displayedMonth = ref<Date | undefined>(new Date(2024, 5, 15))
		const { focusDay, focusedDay } = useKeyboardInteractions(displayedMonth, ref())

		focusDay(new Date(2024, 6, 20))
		await nextTick()

		expect(focusedDay.value).toBe('2024-07-20')
		expect(displayedMonth.value?.getMonth()).toBe(6)
	})
})
