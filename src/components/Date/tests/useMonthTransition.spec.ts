import { describe, expect, it } from 'vitest'
import { nextTick, ref } from 'vue'
import useMonthTransition from '../useMonthTransition'

describe('useMonthTransition', () => {
	it('derives the slide direction from the month changes', async () => {
		const displayedMonth = ref<Date | undefined>(new Date(2024, 5, 15))
		const { slideDirection, transitionProps } = useMonthTransition(displayedMonth)

		// Month change coming from the parent component
		displayedMonth.value = new Date(2024, 6, 1)
		await nextTick()
		expect(slideDirection.value).toBe('next')
		expect(transitionProps.value.name).toBe('slide-next')

		// Month change coming from the keyboard navigation
		displayedMonth.value = new Date(2024, 4, 20)
		await nextTick()
		expect(slideDirection.value).toBe('prev')
		expect(transitionProps.value.name).toBe('slide-prev')
	})
})
