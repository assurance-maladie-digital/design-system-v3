import { describe, it, expect } from 'vitest'
import { useWeekendDays } from '../useWeekendDays'

describe('useWeekendDays', () => {
	describe('displayWeekendDays', () => {
		it('devrait retourner true par défaut', () => {
			const { displayWeekendDays } = useWeekendDays({})

			expect(displayWeekendDays.value).toBe(true)
		})

		it('devrait retourner true si displayWeekendDays=true', () => {
			const { displayWeekendDays } = useWeekendDays({
				displayWeekendDays: true,
			})

			expect(displayWeekendDays.value).toBe(true)
		})

		it('devrait retourner false si displayWeekendDays=false', () => {
			const { displayWeekendDays } = useWeekendDays({
				displayWeekendDays: false,
			})

			expect(displayWeekendDays.value).toBe(false)
		})
	})
})
